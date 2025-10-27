import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-owner-percentage',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './owner-percentage.html',
  styleUrls: ['./owner-percentage.scss'] // ⚠️ c'était "styleUrl" → doit être "styleUrls"
})
export class OwnerPercentage implements OnInit  {
  value_antoine = 0;
  value_arthur = 0;
  ownersTotal = 0;
  portfolio_total = 0;
  percentage_antoine = 0;
  percentage_arthur = 0;
  investment_value = 0;
  cash_value = 0;

  constructor(private portfolioService: PortfolioService){} 

  ngOnInit(): void {
    // Charger les deux valeurs en parallèle
    this.loadUserValue(2, 'antoine');
    this.loadUserValue(3, 'arthur');
    this.portfolioService.getPortfolio().subscribe((response: any) => {
      const data = response?.data;
      if (!Array.isArray(data) || data.length === 0) {
        return;
      }

      const latestEntry = data[data.length - 1] ?? {};
      this.portfolio_total = this.toNumber(
        latestEntry.total_value,
        latestEntry.portfolio_total_value
      );
      this.investment_value = this.toNumber(
        latestEntry.portfolio_total_value,
        latestEntry.invested_value
      );
      this.cash_value = this.toNumber(
        latestEntry.cash_total_value,
        latestEntry.cash_value,
        latestEntry.cash
      );
    });
  }

  private loadUserValue(userId: number, name: 'antoine' | 'arthur'): void {
    this.portfolioService.getValueForUser(userId).subscribe((response: any) => {
      const data = response?.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Format ou contenu vide :', data);
        return;
      }

      const lastSnapshot = data[data.length - 1];
      const value = lastSnapshot.value_held ?? 0;

      if (name === 'antoine') this.value_antoine = value;
      if (name === 'arthur') this.value_arthur = value;

      this.updatePercentages();
    });
  }

  private updatePercentages(): void {
    this.ownersTotal = this.value_antoine + this.value_arthur;
    if (this.ownersTotal > 0) {
      this.percentage_antoine = (this.value_antoine / this.ownersTotal) * 100;
      this.percentage_arthur = (this.value_arthur / this.ownersTotal) * 100;
    } else {
      this.percentage_antoine = this.percentage_arthur = 0;
    }
  }

  private toNumber(...candidates: Array<number | string | null | undefined>): number {
    for (const candidate of candidates) {
      const parsed =
        typeof candidate === 'number'
          ? candidate
          : Number.parseFloat(candidate ?? '');
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return 0;
  }
}
