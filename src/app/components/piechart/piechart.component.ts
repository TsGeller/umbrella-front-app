import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../../services/portfolio';
import { Stock } from '../../models/stock.model';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './piechart.html',
})
export class Piechart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '300px';
  stocks: Stock[] = [];

  constructor(private service: PortfolioService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.service.portfolio$.subscribe((portfolio) => {
        this.stocks = portfolio.getStcokComposition();
        this.initPiechart();
      });
    }, 800);
  }

  initPiechart(): void {
    const labels = this.stocks.map((s) => s.ticker);
    const values = this.stocks.map((s) => s.quantity * s.price);

    this.chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            'rgba(90,108,255,0.75)',   // Indigo doux
            'rgba(100,220,220,0.75)',  // Cyan gris
            'rgba(130,200,255,0.75)',  // Bleu clair
            'rgba(200,180,255,0.75)',  // Lavande
            'rgba(255,160,180,0.75)',  // Rose pâle
            'rgba(255,210,120,0.75)',  // Jaune doux
            'rgba(160,240,160,0.75)',  // Vert clair
          ],
          borderColor: 'rgba(255,255,255,0.7)',
          borderWidth: 1,
          hoverOffset: 8,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            color: '#444',
            font: {
              family: 'Inter',
              size: 12,
              weight: 500,
            },
            padding: 10,
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#111',
          bodyColor: '#333',
          borderColor: 'rgba(0,0,0,0.05)',
          borderWidth: 1,
          padding: 8,
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
        },
      },
      layout: {
        padding: { top: 10, bottom: 10 },
      },
    };
  }
}
