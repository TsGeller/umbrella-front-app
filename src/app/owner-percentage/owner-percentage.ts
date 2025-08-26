import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-owner-percentage',
  imports: [],
  templateUrl: './owner-percentage.html',
  styleUrl: './owner-percentage.scss'
})
export class OwnerPercentage implements OnInit  {
  value_antoine= 0;
  value_arthur= 0; 
  portfolioService: any;
  ngOnInit(): void {
    this.portfolioService.getValueForUser(1).subscribe((response : any)=>{
      const data = response?.data;
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Format ou contenu vide :', data);
      return;
    }
    const values = data.map(entry => parseFloat(entry.nav_per_unit)).filter(v => !isNaN(v));
    })
  }
  
  

}
