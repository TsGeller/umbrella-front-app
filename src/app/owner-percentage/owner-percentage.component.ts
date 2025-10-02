import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { DecimalPipe } from '@angular/common';
import { delay } from 'rxjs';

@Component({
  selector: 'app-owner-percentage',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './owner-percentage.html',
  styleUrl: './owner-percentage.scss'
})
export class OwnerPercentage implements OnInit  {
  value_antoine= 0;
  value_arthur= 0;
  constructor(private portfolioService: PortfolioService){} 
  ngOnInit(): void {
    this.portfolioService.getValueForUser(2).subscribe((response: any) => {
      const data = response?.data;
      console.log(data);

    if (!Array.isArray(data) || data.length === 0) {
      console.error('Format ou contenu vide :', data);
    }

    // Dernier élément
    const lastSnapshot = data[data.length - 1];
    console.log(lastSnapshot);
    this.value_antoine = lastSnapshot.value_held;
    });
    this.portfolioService.getValueForUser(3).subscribe((response: any) => {
      const dataA = response?.data;

    if (!Array.isArray(dataA) || dataA.length === 0) {
      console.error('Format ou contenu vide :', dataA);
    }

    // Dernier élément
    const lastSnapshotA = dataA[dataA.length - 1];
    this.value_arthur = lastSnapshotA.value_held;
  });
}
  
  

}
