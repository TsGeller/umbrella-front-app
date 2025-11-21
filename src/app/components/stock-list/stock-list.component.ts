import { CurrencyPipe, DecimalPipe, NgClass, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio';
import { Stock } from '../../models/stock.model';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss'
})
export class StockList implements OnInit {
  stocks: Stock[] = [];

  constructor(private service: PortfolioService) {}

  ngOnInit(): void {
    // s'abonner au portfolio centralisé
    this.service.portfolio$.subscribe(portfolio => {  
      this.stocks = portfolio.getStcokComposition();
    });

    // charger les holdings via le service
    this.service.loadStockHoldings();
  }

  /**
   * Calcule la valeur totale du portfolio
   * @returns La somme de toutes les positions (prix × quantité)
   */
  getTotalValue(): number {
    return this.stocks.reduce((total, stock) => {
      return total + (stock.price * stock.quantity);
    }, 0);
  }
  getValuePercentage(stock: any): number {
  const total = this.getTotalValue();
  if (!total) return 0;
  return ((stock.price * stock.quantity) / total) * 100;
}
}
