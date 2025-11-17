import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { RiskService, RiskMetric } from '../../services/risk.service';
import { PortfolioService } from '../../services/portfolio';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-risk-cvar-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './risk-cvar-chart.html',
  styleUrl: './risk-cvar-chart.scss'
})
export class RiskCvarChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  loading = true;
  error: string | null = null;

  constructor(
    private riskService: RiskService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    const startDate = this.getDateMinusDays(180);
    forkJoin({
      risk: this.riskService.getPortfolioRiskMetrics(startDate),
      portfolio: this.portfolioService.getPortfolio()
    }).subscribe({
      next: ({ risk, portfolio }) => this.buildChart(risk, portfolio?.data ?? []),
      error: () => {
        this.loading = false;
        this.error = 'Unable to load CVaR chart.';
      }
    });
  }

  private buildChart(riskMetrics: RiskMetric[], portfolioSnapshots: any[]): void {
    this.loading = false;
    if (!riskMetrics.length || !portfolioSnapshots.length) {
      this.error = 'No sufficient data to display the chart yet.';
      return;
    }

    const returnsMap = this.computeReturns(portfolioSnapshots);
    const sortedMetrics = [...riskMetrics].sort((a, b) => a.date.localeCompare(b.date));

    const labels = sortedMetrics.map(item => this.formatLabel(item.date));
    const returnsSeries = sortedMetrics.map(item => returnsMap.get(item.date) ?? null);
    const cvarSeries = sortedMetrics.map(item => -Math.abs(item.CVaR_95_1d_amount));

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Returns %',
          data: returnsSeries,
          borderColor: 'rgba(90,108,255,0.9)',
          backgroundColor: 'rgba(90,108,255,0.2)',
          pointBackgroundColor: '#fff',
          pointRadius: 3,
          tension: 0.35,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'CVaR 95% (€)',
          data: cvarSeries,
          borderColor: 'rgba(255,112,146,0.9)',
          backgroundColor: 'rgba(255,112,146,0.2)',
          pointRadius: 3,
          tension: 0.35,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#444',
            font: { family: 'Inter', size: 12, weight: 500 }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#111',
          bodyColor: '#333',
          borderColor: 'rgba(0,0,0,0.05)',
          borderWidth: 1
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          position: 'left',
          ticks: { color: '#555', callback: (value: number) => `${value?.toFixed?.(0) ?? value}%` },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y1: {
          position: 'right',
          ticks: { color: '#555' },
          grid: { drawOnChartArea: false, color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          ticks: { color: '#666', maxRotation: 0, autoSkip: true },
          grid: { color: 'rgba(0,0,0,0.04)' }
        }
      }
    };
  }

  private computeReturns(snapshots: any[]): Map<string, number> {
    const sorted = [...snapshots]
      .map(entry => ({ date: entry.date, value: parseFloat(entry.nav_per_unit) }))
      .filter(entry => !isNaN(entry.value))
      .sort((a, b) => a.date.localeCompare(b.date));

    const returns = new Map<string, number>();
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (prev.value) {
        const change = ((curr.value - prev.value) / prev.value) * 100;
        returns.set(curr.date, parseFloat(change.toFixed(2)));
      }
    }
    return returns;
  }

  private formatLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  private getDateMinusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
  }
}
