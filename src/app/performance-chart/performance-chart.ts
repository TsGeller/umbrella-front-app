import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-performance-chart',
  imports: [ChartModule],
  templateUrl: './performance-chart.html',
  styleUrl: './performance-chart.scss'
})
export class PerformanceChart {
  chartData: any;
  chartOptions: any;
  heightChart='300px';

  constructor() {
    // Labels : J-29 à aujourd'hui
    const today = new Date();
    const labels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - 29 + i);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    // Valeurs aléatoires entre 0 et 100
const values = Array.from({ length: 30 }, () => Math.floor(Math.random() * 21) - 10);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Performance in %',
          data: values,
          backgroundColor: '#42A5F5'
        }
      ]
    };

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
          min: -10,
          max: 10,  
          ticks: {
            color: '#ffffff',
            callback: (value: number) => value + '%'
          },
          grid: { color: 'rgba(255,255,255,0.2)' }
        }
      }
    };
  }
}
