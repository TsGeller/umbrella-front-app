import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PortfolioService } from '../../services/portfolio';
import { Stock } from '../../models/stock.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './piechart.html',
  styleUrls: ['./piechart.scss'],
})
export class Piechart implements OnInit {
  chartData: any;
  chartOptions: any;
  heightChart = '240px';
  stocks: Stock[] = [];
  segments: { label: string; value: number; percent: number; color: string }[] = [];
  topLabel = '';
  topPercent = 0;
  totalValue = 0;
  hoverLabel = '';
  hoverValue = 0;
  hoverPercent = 0;

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
    const labels = this.stocks.map((s) => s.name || s.ticker);
    const values = this.stocks.map((s) => s.quantity * s.price);
    const palette = ['#22c55e', '#f97316', '#f59e0b', '#ef4444', '#6366f1', '#0ea5e9', '#8b5cf6'];

    const total = values.reduce((a, b) => a + (b || 0), 0);
    this.totalValue = total;

    const maxIndex = values.indexOf(Math.max(...values));
    this.topLabel = labels[maxIndex] || 'Allocation';
    this.topPercent = total ? (values[maxIndex] / total) * 100 : 0;
    this.hoverLabel = this.topLabel;
    this.hoverValue = values[maxIndex] || 0;
    this.hoverPercent = this.topPercent;

    this.segments = labels.map((label, idx) => {
      const value = values[idx] || 0;
      const percent = total ? (value / total) * 100 : 0;
      const color = palette[idx % palette.length];
      return { label, value, percent, color };
    });

    this.chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: palette,
          borderColor: '#ffffff',
          borderWidth: 10,
          hoverOffset: 8,
          cutout: '70%',
          borderRadius: 18,
          spacing: 2,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: (context: any) => this.updateHoverFromTooltip(context),
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
      layout: { padding: 10 },
    };
  }

  private updateHoverFromTooltip(context: any) {
    const { chart, tooltip } = context;
    if (tooltip.opacity === 0) {
      // revert to top allocation when not hovering
      this.hoverLabel = this.topLabel;
      this.hoverValue = this.totalValue * (this.topPercent / 100);
      this.hoverPercent = this.topPercent;
      return;
    }

    const dataIndex = tooltip.dataPoints?.[0]?.dataIndex ?? 0;
    const datasetIndex = tooltip.dataPoints?.[0]?.datasetIndex ?? 0;
    const label = chart.data.labels[dataIndex] as string;
    const value = chart.data.datasets[datasetIndex].data[dataIndex] as number;
    const percent = this.totalValue ? (value / this.totalValue) * 100 : 0;

    this.hoverLabel = label;
    this.hoverValue = value;
    this.hoverPercent = percent;
  }
}
