import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [TableModule, CurrencyPipe],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss'
})
export class StockList implements OnInit {
  products: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // put this in a service but for the moment its ok
    this.http.get<any[]>('http://localhost:3000/portfolio')
      .subscribe(data => {
        this.products = data;
      });
  }
}
