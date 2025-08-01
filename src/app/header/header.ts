import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  portfolio: any;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.getMockPortfolio('1').subscribe(data => {
      this.portfolio = data;
    });
  }
}

