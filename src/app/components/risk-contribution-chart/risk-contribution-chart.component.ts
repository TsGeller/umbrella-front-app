import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { RiskContribution, RiskService } from '../../services/risk.service';

@Component({
  selector: 'app-risk-contribution-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './risk-contribution-chart.html',
  styleUrl: './risk-contribution-chart.scss'
})
export class RiskContributionChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  loading = true;
  error: string | null = null;

  constructor(private riskService: RiskService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.riskService.getStockContributionRiskMetrics(today).subscribe({
      next: contributions => this.buildChart(contributions),
      error: () => {
        this.loading = false;
        this.error = 'Unable to load risk contribution.';
      }
    });
  }

  private buildChart(contributions: RiskContribution[]): void {
    this.loading = false;
    if (!contributions.length) {
      this.error = 'No contribution data for today.';
      return;
    }

    const latestDate = [...contributions]
      .map(item => item.date)
      .sort()
      .at(-1);

    const filtered = contributions
      .filter(item => item.date === latestDate)
      .sort((a, b) => b.risk_contribution_pct - a.risk_contribution_pct)
      .slice(0, 8);

    const labels = filtered.map(item => item.ticker);
    const data = filtered.map(item => (item.risk_contribution_pct || 0) * 100);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Contribution %',
          data,
          backgroundColor: 'rgba(132, 171, 255, 0.9)',
          borderRadius: 12,
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#111',
          bodyColor: '#333',
          callbacks: {
            label: (context: any) => `${context.formattedValue}%`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#555', callback: (value: number) => `${value}%` },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y: {
          ticks: { color: '#444' },
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    };
  }
}
