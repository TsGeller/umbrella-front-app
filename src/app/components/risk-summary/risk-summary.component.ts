import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RiskService, RiskMetric } from '../../services/risk.service';

interface MetricCard {
  label: string;
  value: string;
  subLabel?: string;
}

@Component({
  selector: 'app-risk-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-summary.html',
  styleUrl: './risk-summary.scss'
})
export class RiskSummaryComponent implements OnInit {
  cards: MetricCard[] = [];
  loading = true;
  error: string | null = null;

  constructor(private riskService: RiskService) {}

  ngOnInit(): void {
    const startDate = this.getDateMinusDays(30);
    this.riskService.getPortfolioRiskMetrics(startDate).subscribe({
      next: metrics => this.populateCards(metrics),
      error: () => {
        this.loading = false;
        this.error = 'Unable to load risk metrics.';
      }
    });
  }

  private populateCards(metrics: RiskMetric[]): void {
    this.loading = false;
    if (!metrics.length) {
      this.error = 'No risk data available yet.';
      return;
    }

    const latest = [...metrics].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!;
    const volatility = latest.volatility * 100;
    const cvar = latest.CVaR_95_1d_amount;
    const maxDrawdown = latest.max_drawdown * 100;
    const diversificationScore = (1 - Math.min(latest.drawdown, 0.99)) * 100;

    this.cards = [
      { label: 'Volatility', value: `${volatility.toFixed(2)}%` },
      { label: 'CVaR 95%', value: `${cvar.toFixed(2)}€`, subLabel: '1-day loss expectation' },
      { label: 'Max Drawdown', value: `${maxDrawdown.toFixed(2)}%` },
      { label: 'Diversification Score', value: diversificationScore.toFixed(2) }
    ];
  }

  private getDateMinusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
  }
}
