import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-summary-wallet',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  templateUrl: './summary-wallet.html',
  styleUrls: ['./summary-wallet.scss'],
})
export class SummaryWallet implements OnInit {
  walletValue: number = 0;
  dailyPnL: number = 0;
  pnlPercentage: number = 0;
  hasPnL: boolean = false;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe((response: any) => {
      const data = response?.data;
      if (!Array.isArray(data) || data.length < 2) {
        console.error('Pas assez de données pour calculer le PnL');
        return;
      }

      // Dernière et avant-dernière valeurs
      const latest = parseFloat(data[data.length - 1].total_value);
      const previous = parseFloat(data[data.length - 2].total_value);

      if (isNaN(latest) || isNaN(previous)) return;

      this.walletValue = latest;
      this.dailyPnL = latest - previous;
      this.pnlPercentage = ((latest - previous) / previous) * 100;
      this.hasPnL = true;
    });
  }
}
