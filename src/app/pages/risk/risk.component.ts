import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiskSummaryComponent } from '../../components/risk-summary/risk-summary.component';
import { RiskCvarChartComponent } from '../../components/risk-cvar-chart/risk-cvar-chart.component';
import { RiskDrawdownChartComponent } from '../../components/risk-drawdown-chart/risk-drawdown-chart.component';
import { RiskContributionChartComponent } from '../../components/risk-contribution-chart/risk-contribution-chart.component';

@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [CommonModule, RouterLink, RiskSummaryComponent, RiskCvarChartComponent, RiskDrawdownChartComponent, RiskContributionChartComponent],
  templateUrl: './risk.html',
  styleUrl: './risk.scss'
})
export class RiskComponent {

}
