import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './performance-chart.html',
  styleUrls: ['./performance-chart.scss'] // <-- ici au pluriel
})
export class PerformanceChart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '300px';
  portfolio: any;

  constructor(private portfolioService: PortfolioService) {
    // Configuration des options du graphique (fixe)
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.2)' }
        },
        y: {
          ticks: {
            color: '#ffffff'
          },
          grid: { color: 'rgba(255,255,255,0.2)' }
        }
      }
    };
  }

  ngOnInit(): void {
  this.portfolioService.getPortfolio().subscribe((response: any) => {
    const data = response?.data;
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Format ou contenu vide :', data);
      return;
    }

    const labels = data.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const values = data.map(entry => parseFloat(entry.nav_per_unit)).filter(v => !isNaN(v));

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'NAV per Unit',
          data: values,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          fill: false,
          tension: 0.3
        }
      ]
    };
  });
}

}
