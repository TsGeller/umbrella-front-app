import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-stock-list',
  imports: [TableModule,CurrencyPipe],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss'
})
export class StockList {
  products = [
  { stockName: 'Apple Inc. (AAPL)', name: 'Apple', quantity: 50, price: 195.30 },
  { stockName: 'Microsoft Corp. (MSFT)', name: 'Microsoft', quantity: 30, price: 345.60 },
  { stockName: 'Tesla Inc. (TSLA)', name: 'Tesla', quantity: 20, price: 710.00 },
  { stockName: 'Amazon.com Inc. (AMZN)', name: 'Amazon', quantity: 10, price: 135.80 },
  { stockName: 'Amazon.com Inc. (AMZN)', name: 'Amazon', quantity: 10, price: 135.80 },
  { stockName: 'Amazon.com Inc. (AMZN)', name: 'Amazon', quantity: 10, price: 135.80 },
  { stockName: 'Amazon.com Inc. (AMZN)', name: 'Amazon', quantity: 10, price: 135.80 },
  { stockName: 'NVIDIA Corp. (NVDA)', name: 'NVIDIA', quantity: 15, price: 850.25 }
];

}
