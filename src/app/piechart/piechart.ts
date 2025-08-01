import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-piechart',
  imports: [ChartModule],
  templateUrl: './piechart.html',
  styleUrl: './piechart.scss'
})
export class Piechart {
 chartData: any;
  chartOptions: any;
  heightChart= '250px';

  constructor() {
    this.chartData = {
      labels: ['NVDA', 'BTC', 'ETH','BEL20','BOEING'],
      datasets: [
        {
          data: [20, 30, 30, 10,10],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726','#022AA3', '#A21AB3'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      }
    };
  }
}

