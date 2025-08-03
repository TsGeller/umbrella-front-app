import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-summary-wallet',
  imports: [],
  templateUrl: './summary-wallet.html',
  styleUrl: './summary-wallet.scss'
})
export class SummaryWallet implements OnInit {
  portfolio: any;
  walletValue: number = 0;
  totalInvest: number = 500;

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

      if (!isNaN(totalValue)) {
        this.walletValue = totalValue;
      } else {
        console.error('Valeur totale invalide :', latestEntry.total_value);
      }
    });
  }
}