import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { RiskService, RiskMetric } from '../../services/risk.service';

@Component({
  selector: 'app-risk-drawdown-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './risk-drawdown-chart.html',
  styleUrl: './risk-drawdown-chart.scss'
})
export class RiskDrawdownChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  loading = true;
  error: string | null = null;

  constructor(private riskService: RiskService) {}

  ngOnInit(): void {
    const startDate = this.getDateMinusDays(180);
    this.riskService.getPortfolioRiskMetrics(startDate).subscribe({
      next: metrics => this.buildChart(metrics),
      error: () => {
        this.loading = false;
        this.error = 'Unable to load drawdown chart.';
      }
    });
  }

  private buildChart(metrics: RiskMetric[]): void {
    this.loading = false;
    if (!metrics.length) {
      this.error = 'No drawdown data yet.';
      return;
    }

    const sorted = [...metrics].sort((a, b) => a.date.localeCompare(b.date));
    const labels = sorted.map(item => this.formatLabel(item.date));
    const drawdownSeries = sorted.map(item => -(item.drawdown || 0) * 100);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Drawdown %',
          data: drawdownSeries,
          borderColor: 'rgba(146, 176, 255, 0.85)',
          backgroundColor: 'rgba(146, 176, 255, 0.25)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#fff',
          pointRadius: 3
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
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#111',
          bodyColor: '#333',
          borderColor: 'rgba(0,0,0,0.05)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          ticks: { color: '#555', callback: (value: number) => `${value}%` },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          ticks: { color: '#666', maxRotation: 0, autoSkip: true },
          grid: { color: 'rgba(0,0,0,0.04)' }
        }
      }
    };
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
