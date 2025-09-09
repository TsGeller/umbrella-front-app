import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../services/portfolio';
import { Stock } from '../models/stock.model';

@Component({
  selector: 'app-piechart',
  imports: [ChartModule],
  templateUrl: './piechart.html',
  styleUrl: './piechart.scss'
})
export class Piechart implements OnInit {
 chartData: any;
  chartOptions: any;
  heightChart= '250px';
  stocks: Stock[] = [];
  data: any;
  quantity=0;

  constructor(private service: PortfolioService) {}
  ngOnInit():void {
    setTimeout(() => {this.service.portfolio$.subscribe(portfolio => {  
      this.stocks = portfolio.getStcokComposition();
      var quantity= 0;
      for (let stock of this.stocks) {
        this.quantity= this.quantity + stock.quantity*stock.price;
      
      }
      this.initPiechart();
    });
    }, 1000);
  }
  initPiechart(): void {
    this.chartData = {
      labels: this.stocks.map(stock => stock.ticker),
      datasets: [
        {
          data: this.stocks.map(stock => stock.quantity*stock.price),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726','#022AA3', '#A21AB3','#FF6384'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D','#2a02a3','#ca21df','#FF6384']
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#000000'
          }
        }
      }
    };
  }
}

