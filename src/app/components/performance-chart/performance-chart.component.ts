import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './performance-chart.html',
})
export class PerformanceChart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '300px';

  constructor(private portfolioService: PortfolioService) {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#444',
            font: { family: 'Inter', size: 12, weight: 500 },
            boxWidth: 10,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#111',
          bodyColor: '#333',
          borderColor: 'rgba(0,0,0,0.05)',
          borderWidth: 1,
          padding: 10,
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
        },
      },
      elements: {
        point: {
          radius: 0, // ✅ supprime les points
          hoverRadius: 0, // pas d’effet au survol
        },
        line: {
          borderJoinStyle: 'round',
        },
      },
      scales: {
        x: {
          ticks: { color: '#555', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y: {
          ticks: { color: '#555', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y1: {
          position: 'right',
          ticks: { color: '#555', font: { family: 'Inter', size: 11 } },
          grid: { drawOnChartArea: false, color: 'rgba(0,0,0,0.05)' },
        },
      },
    };
  }

  ngOnInit(): void {
    this.portfolioService.getPriceForTickerSpydde().subscribe((spyResponse: any) => {
      const spyData = spyResponse?.map((d: any) => parseFloat(d.nav)).filter((v: number) => !isNaN(v));

      this.portfolioService.getPortfolio().subscribe((portfolioResponse: any) => {
        const data = portfolioResponse?.data;
        if (!Array.isArray(data) || data.length === 0) return;

        const labels = data.map((entry) => {
          const date = new Date(entry.date);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const values = data.map((entry: any) => parseFloat(entry.nav_per_unit)).filter((v: number) => !isNaN(v));

        this.chartData = {
          labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: values,
              borderColor: 'rgba(90,108,255,0.7)', // ✅ bleu adouci
              backgroundColor: 'rgba(90,108,255,0.08)', // léger remplissage
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              yAxisID: 'y',
            },
            {
              label: 'S&P 500 (SPY.DDE)',
              data: spyData,
              borderColor: 'rgba(255,107,107,0.6)', // ✅ rouge adouci
              backgroundColor: 'rgba(255,107,107,0.05)', // plus subtil
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        };
      });
    });
  }
}
