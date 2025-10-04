import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-owner-percentage',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './owner-percentage.html',
  styleUrls: ['./owner-percentage.scss'] // ⚠️ c'était "styleUrl" → doit être "styleUrls"
})
export class OwnerPercentage implements OnInit  {
  value_antoine = 0;
  value_arthur = 0;
  total_value = 0;
  percentage_antoine = 0;
  percentage_arthur = 0;

  constructor(private portfolioService: PortfolioService){} 

  ngOnInit(): void {
    // Charger les deux valeurs en parallèle
    this.loadUserValue(2, 'antoine');
    this.loadUserValue(3, 'arthur');
  }

  private loadUserValue(userId: number, name: 'antoine' | 'arthur'): void {
    this.portfolioService.getValueForUser(userId).subscribe((response: any) => {
      const data = response?.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Format ou contenu vide :', data);
        return;
      }

      const lastSnapshot = data[data.length - 1];
      const value = lastSnapshot.value_held ?? 0;

      if (name === 'antoine') this.value_antoine = value;
      if (name === 'arthur') this.value_arthur = value;

      this.updatePercentages();
    });
  }

  private updatePercentages(): void {
    this.total_value = this.value_antoine + this.value_arthur;
    if (this.total_value > 0) {
      this.percentage_antoine = (this.value_antoine / this.total_value) * 100;
      this.percentage_arthur = (this.value_arthur / this.total_value) * 100;
    } else {
      this.percentage_antoine = this.percentage_arthur = 0;
    }
  }
}
