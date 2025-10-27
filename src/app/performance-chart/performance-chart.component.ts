import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { combineLatest } from 'rxjs';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './performance-chart.html',
  styleUrl: './performance-chart.scss',
})
export class PerformanceChart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '180px';

  private fullLabels: string[] = [];
  private fullPortfolioSeries: number[] = [];
  private fullIndexSeries: number[] = [];
  private visibleStart = 0;
  private visibleEnd = 0;
  private readonly minVisiblePoints = 12;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.configureChartOptions();
    this.applyFallbackSeries();

    combineLatest([
      this.portfolioService.getPortfolio(),
      this.portfolioService.getPriceForTickerSpydde()
    ]).subscribe(([portfolioResponse, indexResponse]) => {
      const portfolio = Array.isArray(portfolioResponse?.data) ? portfolioResponse.data : [];
      const indexValues = Array.isArray(indexResponse) ? indexResponse : [];

      if (!portfolio.length || !indexValues.length) {
        this.applyFallbackSeries();
        return;
      }

      const { labels, navSeries, spySeries } = this.buildSeries(portfolio, indexValues);

      if (!labels.length) {
        this.applyFallbackSeries();
        return;
      }

      this.setFullSeries(labels, navSeries, spySeries);
    });
  }

  onWheel(event: WheelEvent): void {
    if (!this.canInteractWithZoom()) {
      return;
    }

    event.preventDefault();

    const range = this.visibleEnd - this.visibleStart + 1;
    const delta = Math.max(1, Math.round(range * 0.12));

    if (event.deltaY < 0) {
      if (range <= this.minVisiblePoints) {
        return;
      }

      this.visibleStart = Math.min(
        this.visibleStart + delta,
        Math.max(this.visibleEnd - (this.minVisiblePoints - 1), 0)
      );
      this.visibleEnd = Math.max(
        this.visibleEnd - delta,
        this.visibleStart + (this.minVisiblePoints - 1)
      );
    } else {
      this.visibleStart = Math.max(this.visibleStart - delta, 0);
      this.visibleEnd = Math.min(
        this.visibleEnd + delta,
        this.fullLabels.length - 1
      );
    }

    this.updateChartData();
  }

  resetZoom(): void {
    if (!this.fullLabels.length) {
      return;
    }
    this.visibleStart = 0;
    this.visibleEnd = this.fullLabels.length - 1;
    this.updateChartData();
  }

  get isZoomed(): boolean {
    if (this.fullLabels.length <= this.minVisiblePoints) {
      return false;
    }
    return (
      this.visibleStart > 0 ||
      this.visibleEnd < this.fullLabels.length - 1
    );
  }

  private canInteractWithZoom(): boolean {
    return this.fullLabels.length > this.minVisiblePoints;
  }

  private buildSeries(portfolio: any[], indexValues: any[]) {
    const portfolioMap = new Map<string, number>();
    const labelMap = new Map<string, string>();

    portfolio.forEach((entry: any) => {
      const date = this.extractDate(entry?.date || entry?.timestamp || entry?.created_at);
      const nav = this.pickNumeric(entry?.nav_per_unit, entry?.nav, entry?.value);

      if (!date || nav === null) {
        return;
      }

      portfolioMap.set(date.key, nav);
      labelMap.set(date.key, date.label);
    });

    const indexMap = new Map<string, number>();
    indexValues.forEach((entry: any) => {
      const date = this.extractDate(entry?.date || entry?.timestamp || entry?.created_at);
      const value = this.pickNumeric(entry?.nav, entry?.close_euro, entry?.close);

      if (!date || value === null) {
        return;
      }

      indexMap.set(date.key, value);
      labelMap.set(date.key, date.label);
    });

    const commonKeys = Array.from(labelMap.keys()).filter(
      (key) => portfolioMap.has(key) && indexMap.has(key)
    );

    commonKeys.sort((a, b) => (a > b ? 1 : -1));

    const labels = commonKeys.map((key) => labelMap.get(key) ?? key);
    const navSeries = commonKeys.map((key) => portfolioMap.get(key) ?? 0);
    const spySeries = commonKeys.map((key) => indexMap.get(key) ?? 0);

    return { labels, navSeries, spySeries };
  }

  private setFullSeries(labels: string[], navSeries: number[], spySeries: number[]): void {
    this.fullLabels = labels;
    this.fullPortfolioSeries = navSeries;
    this.fullIndexSeries = spySeries;
    this.visibleStart = 0;
    this.visibleEnd = Math.max(labels.length - 1, 0);
    this.updateChartData();
  }

  private updateChartData(): void {
    const total = this.fullLabels.length;

    if (!total) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    const minWindow = Math.min(this.minVisiblePoints, total);

    this.visibleStart = Math.max(0, Math.min(this.visibleStart, total - minWindow));
    this.visibleEnd = Math.max(
      this.visibleStart + minWindow - 1,
      Math.min(this.visibleEnd, total - 1)
    );

    const labels = this.fullLabels.slice(this.visibleStart, this.visibleEnd + 1);
    const navSegment = this.fullPortfolioSeries.slice(this.visibleStart, this.visibleEnd + 1);
    const spySegment = this.fullIndexSeries.slice(this.visibleStart, this.visibleEnd + 1);

    this.chartData = this.composeChartData(labels, navSegment, spySegment);
  }

  private composeChartData(labels: string[], navSeries: number[], spySeries: number[]) {
    return {
      labels,
      datasets: [
        {
          label: 'Portfolio NAV',
          data: navSeries,
          borderColor: '#8C7CFF',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          tension: 0.4,
          backgroundColor: this.createGradient([
            'rgba(140,124,255,0.32)',
            'rgba(140,124,255,0.08)',
          ]),
        },
        {
          label: 'SPY NAV',
          data: spySeries,
          borderColor: '#5FD3C7',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.35,
          backgroundColor: this.createGradient([
            'rgba(95,211,199,0.28)',
            'rgba(95,211,199,0.08)',
          ]),
        },
      ],
    };
  }

  private applyFallbackSeries(): void {
    const fallback = this.buildFallbackSeries();
    this.setFullSeries(fallback.labels, fallback.navSeries, fallback.spySeries);
  }

  private pickNumeric(...candidates: Array<string | number | null | undefined>): number | null {
    for (const candidate of candidates) {
      const parsed = typeof candidate === 'number' ? candidate : Number.parseFloat(candidate ?? '');
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return null;
  }

  private extractDate(raw: string | number | Date | undefined | null) {
    if (!raw) {
      return null;
    }

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const key = date.toISOString().split('T')[0];
    const label = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

    return { key, label };
  }

  private configureChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
          labels: {
            color: '#f4f5f9',
            usePointStyle: true,
            boxWidth: 12,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(20, 20, 35, 0.9)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#F5F7FF',
          bodyColor: '#E2E6F3',
          displayColors: false,
          padding: 12,
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255,255,255,0.08)',
            drawBorder: false,
          },
          ticks: {
            color: '#66727D',
            font: { family: 'Inter', size: 12 },
            padding: 8,
          },
        },
        y: {
          grid: {
            color: 'rgba(255,255,255,0.06)',
            drawBorder: false,
          },
          ticks: {
            color: '#66727D',
            font: { family: 'Inter', size: 12 },
            padding: 8,
          },
          beginAtZero: true,
        },
      },
    };
  }

  private createGradient(colorStops: string[]) {
    return (context: any) => {
      const chart = context?.chart;
      const { ctx, chartArea } = chart || {};

      if (!chartArea) {
        return colorStops[colorStops.length - 1];
      }

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      const step = 1 / (colorStops.length - 1);
      colorStops.forEach((color, index) => {
        gradient.addColorStop(index * step, color);
      });
      return gradient;
    };
  }

  private buildFallbackSeries() {
    const labels = Array.from({ length: 8 }, (_, index) =>
      new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
        month: '2-digit',
        day: '2-digit',
      })
    );

    return {
      labels,
      navSeries: [42, 45, 48, 52, 57, 60, 68, 75],
      spySeries: [38, 41, 43, 47, 50, 54, 58, 62],
    };
  }
}
