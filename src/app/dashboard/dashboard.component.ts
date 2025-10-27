import { Component } from '@angular/core';
import { SummaryWallet } from '../summary-wallet/summary-wallet.component';
import { PerformanceChart } from '../performance-chart/performance-chart.component';
import { Piechart } from '../piechart/piechart.component';
import { OwnerPercentage } from '../owner-percentage/owner-percentage.component';
import { StockList } from '../stock-list/stock-list.component';
import { Header } from '../header/header.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
     Header, SummaryWallet, PerformanceChart, ChartModule, Piechart, StockList, OwnerPercentage
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {}
