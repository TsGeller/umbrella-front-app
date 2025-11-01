import { Component } from '@angular/core';
import { SummaryWallet } from '../../components/summary-wallet/summary-wallet.component';
import { Piechart } from '../../components/piechart/piechart.component';
import { PerformanceChart } from '../../components/performance-chart/performance-chart.component';
import { StockList } from '../../components/stock-list/stock-list.component';
import { OwnerPercentage } from '../../components/owner-percentage/owner-percentage.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SummaryWallet,SummaryWallet,Piechart,PerformanceChart,StockList,OwnerPercentage],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

}
