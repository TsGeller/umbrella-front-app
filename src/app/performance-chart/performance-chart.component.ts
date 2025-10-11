import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './performance-chart.html',
})
export class PerformanceChart implements OnInit {
  chartData: any;
  chartOptions: any;
  chartSpyddeData: any;
  heightChart = '300px';

  constructor(private portfolioService: PortfolioService) {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#E8ECF2', // texte clair
            font: { family: 'Inter', size: 12 },
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
      scales: {
        x: {
          ticks: { color: '#9AA5B8', font: { family: 'Inter' } },
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
        y: {
          ticks: { color: '#9AA5B8', font: { family: 'Inter' } },
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
        y1: {
          position: 'right',
          ticks: { color: '#9AA5B8', font: { family: 'Inter' } },
          grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.05)' },
        },
      },
    };
  }

  ngOnInit(): void {
    this.portfolioService.getPriceForTickerSpydde().subscribe((response: any) => {
      const spyddeData = response;
      console.log('Données SPY.DDE reçues :', spyddeData);
      
      this.portfolioService.getPortfolio().subscribe((response: any) => {
        const data = response?.data;
        console.log('Données de portefeuille reçues :', data);
        if (!Array.isArray(data) || data.length === 0) return;

        const labels = data.map((entry) => {
          const date = new Date(entry.date);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const values = data
          .map((entry: any) => parseFloat(entry.nav_per_unit))
          .filter((v: number) => !isNaN(v));
          console.log('avant traitement  :', spyddeData);
        const valuesspy = spyddeData
          .map((entry: any) => parseFloat(entry.nav))
          .filter((v:number ) => !isNaN(v));
          console.log('Données SPY.DDE traitées :', valuesspy);
        this.chartData = {
          labels,
          datasets: [
            {
              label: 'NAV per Unit',
              data: values,
              borderColor: '#5A6CFF', // brand color
              backgroundColor: 'rgba(90,108,255,0.15)',
              pointBackgroundColor: '#20E3B2',
              pointBorderColor: '#141A29',
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              yAxisID: 'y'
            },
            {
              label: 'SNP 500 (SPY.DDE)',
              data: valuesspy, 
              borderColor: '#FF6B6B', // red color
              backgroundColor: 'rgba(255,107,107,0.15)',
              pointBackgroundColor: '#FF6B6B',
              pointBorderColor: '#141A29',
              borderWidth: 2,
              yAxisID: 'y1'
            }
          ],
        };
      });
    });
  }
}
