import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-summary-wallet',
  imports: [DecimalPipe],
  templateUrl: './summary-wallet.html',
  styleUrl: './summary-wallet.scss'
})
export class SummaryWallet implements OnInit {
  portfolio: any;
  walletValue: number = 0;
  totalInvest: number = 0;
  dailyPl: number | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe((response: any) => {
      const data = response?.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Format ou contenu vide :', data);
        return;
      }

      // On prend la dernière entrée (la plus récente)
      const latestEntry = data[data.length - 1];
      const totalValue = parseFloat(latestEntry.total_value);
      const totalInvest = parseFloat(latestEntry.portfolio_total_value);
      const previousEntry = data.length > 1 ? data[data.length - 2] : null;
      const previousValue = previousEntry ? parseFloat(previousEntry.total_value) : null;

      if (!isNaN(totalValue)) {
        this.walletValue = totalValue;
        this.totalInvest = isNaN(totalInvest) ? 0 : totalInvest;
        if (previousValue !== null && !isNaN(previousValue)) {
          this.dailyPl = totalValue - previousValue;
        } else {
          this.dailyPl = null;
        }
      } else {
        console.error('Valeur totale invalide :', latestEntry.total_value);
      }
    });
  }
}
