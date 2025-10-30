import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { PortfolioService } from '../services/portfolio';
import { Stock } from '../models/stock.model';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [TableModule, CurrencyPipe],
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
}