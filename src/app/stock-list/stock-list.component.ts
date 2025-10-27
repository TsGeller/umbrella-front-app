import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { Stock } from '../models/stock.model';

interface StockRow {
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  totalValue: number;
  weight: number;
  color: string;
}

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, PercentPipe],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss'
})
export class StockList implements OnInit {
  rows: StockRow[] = [];
  totalValue = 0;
  hasData = false;

  private readonly colorPalette = [
    '#6C6CFF',
    '#FF7B8A',
    '#5CE1E6',
    '#FFC378',
    '#B983FF',
    '#4ADE80',
    '#F472B6',
    '#94A3B8'
  ];

  constructor(private service: PortfolioService) {}

  ngOnInit(): void {
    this.service.portfolio$.subscribe(portfolio => {  
      const composition = portfolio.getStcokComposition() || [];
      this.updateRows(composition);
    });

    this.service.loadStockHoldings();
  }

  private updateRows(stocks: Stock[]): void {
    const computed = stocks.map((stock, index) => {
      const quantity = Number(stock.quantity ?? 0);
      const price = Number(stock.price ?? 0);
      const totalValue = quantity * price;

      return {
        ticker: stock.ticker,
        name: stock.name,
        quantity,
        price,
        totalValue,
        color: this.colorPalette[index % this.colorPalette.length],
      };
    });

    this.totalValue = computed.reduce((sum, item) => sum + item.totalValue, 0);

    this.rows = computed
      .map((item) => ({
        ...item,
        weight: this.totalValue > 0 ? item.totalValue / this.totalValue : 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue);

    this.hasData = this.rows.length > 0;
  }
}
