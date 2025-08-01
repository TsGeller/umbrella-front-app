import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import {SummaryWallet} from "./summary-wallet/summary-wallet"
import { PerformanceChart } from "./performance-chart/performance-chart";
import { ChartModule } from 'primeng/chart';
import { Piechart } from './piechart/piechart';
import { StockList } from "./stock-list/stock-list";
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-root',
  imports: [Header, SummaryWallet, PerformanceChart, ChartModule, Piechart, StockList,TableModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Front-Umbrella');
}
