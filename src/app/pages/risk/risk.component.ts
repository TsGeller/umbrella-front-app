import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiskSummaryComponent } from '../../components/risk-summary/risk-summary.component';

@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [CommonModule, RouterLink, RiskSummaryComponent],
  templateUrl: './risk.html',
  styleUrl: './risk.scss'
})
export class RiskComponent {

}
