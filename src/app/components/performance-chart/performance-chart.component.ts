import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './performance-chart.html',
  styleUrls: ['./performance-chart.scss'],
})
export class PerformanceChart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '300px';

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.chartOptions = this.buildChartOptions();

    this.portfolioService.getPriceForTickerSpydde().subscribe((spyResponse: any) => {
      const spyData = spyResponse?.map((d: any) => parseFloat(d.nav)).filter((v: number) => !isNaN(v));

      this.portfolioService.getPortfolio().subscribe((portfolioResponse: any) => {
        const data = portfolioResponse?.data;
        if (!Array.isArray(data) || data.length === 0) return;

        const labels = data.map((entry) => {
          const date = new Date(entry.date);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const values = data.map((entry: any) => parseFloat(entry.nav_per_unit)).filter((v: number) => !isNaN(v));

        this.chartData = this.buildChartData(labels, values, spyData);
      });
    });
  }

  private buildChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: 'index',
          displayColors: false,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: 'rgba(0,0,0,0.08)',
          borderWidth: 1,
          titleColor: '#111',
          bodyColor: '#111',
          padding: 10,
          callbacks: {
            label: (context: any) => {
              const label = context.dataset?.label ?? '';
              const value = Number(context.raw ?? 0);
              const formatted = value.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return `${label}: ${formatted}`;
            },
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
          borderWidth: 3,
          backgroundColor: '#22c55e',
        },
        line: {
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          ticks: { color: 'rgba(17,24,39,0.6)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(0,0,0,0.035)' },
        },
        y: {
          ticks: { color: 'rgba(17,24,39,0.6)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(0,0,0,0.035)' },
        },
      },
    };
  }

  private buildChartData(labels: string[], values: number[], spyData: number[]) {
    return {
      labels,
      datasets: [
        {
          label: 'Portfolio',
          data: values,
          borderColor: 'rgba(90,108,255,0.9)',
          backgroundColor: this.gradientFill('rgba(90,108,255,0.28)', 'rgba(90,108,255,0.02)'),
          borderWidth: 2.5,
          fill: true,
          tension: 0.38,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'SPY',
          data: spyData,
          borderColor: 'rgba(34,197,94,0.85)',
          backgroundColor: this.gradientFill('rgba(34,197,94,0.24)', 'rgba(34,197,94,0.02)'),
          borderWidth: 2.5,
          fill: true,
          tension: 0.38,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  private gradientFill(top: string, bottom: string) {
    return (context: any) => {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) {
        return top;
      }
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, top);
      gradient.addColorStop(1, bottom);
      return gradient;
    };
  }
  
}