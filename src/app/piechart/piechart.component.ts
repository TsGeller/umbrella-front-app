import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../services/portfolio';
import { Stock } from '../models/stock.model';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './piechart.html',
})
export class Piechart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '250px';
  stocks: Stock[] = [];

  constructor(private service: PortfolioService) {}

  ngOnInit(): void {
    // Laisse un délai si le service charge lentement
    setTimeout(() => {
      this.service.portfolio$.subscribe((portfolio) => {
        this.stocks = portfolio.getStcokComposition();
        this.initPiechart();
      });
    }, 1000);
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
            '#4F46E5', // Indigo
        '#06B6D4', // Cyan clair
        '#22C55E', // Vert émeraude
        '#EAB308', // Jaune doré
        '#F97316', // Orange doux
        '#EC4899', // Rose magenta
        '#8B5CF6', // Violet pastel
          ],
          hoverBackgroundColor: [
            '#7C84FF',
            '#41EBC8',
            '#A59EFF',
            '#28F5B0',
            '#FFC14A',
            '#FF6A6A',
          ],
          borderColor: '#0B0F1A',
          borderWidth: 2,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#E8ECF2', // texte clair
            font: {
              family: 'Inter',
              size: 12,
            },
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(20,25,40,0.9)',
          titleColor: '#E8ECF2',
          bodyColor: '#9AA5B8',
          borderWidth: 0,
          padding: 10,
        },
      },
    };
  }
}
