import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TransactionsService, Transaction } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['date', 'type', 'ticker', 'shares', 'amount'];
  dataSource = new MatTableDataSource<Transaction>([]);
  loading = true;
  error: string | null = null;
  filterType: string = '';
  filterTicker: string = '';
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    const startDate = this.getDateMinusDays(180);
    this.transactionsService.getTransactions({ startDate }).subscribe({
      next: txns => {
        this.dataSource.data = txns ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load transactions right now.';
      }
    });
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: Transaction) => {
      const matchesType = this.filterType ? data.type?.toLowerCase().includes(this.filterType.toLowerCase()) : true;
      const matchesTicker = this.filterTicker ? (data.ticker || '').toLowerCase().includes(this.filterTicker.toLowerCase()) : true;
      return matchesType && matchesTicker;
    };
    const filterValue = `${this.filterType}|${this.filterTicker}`.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterTicker = '';
    this.applyFilters();
  }

  getAmount(transaction: Transaction): number {
    return transaction.amount ?? 0;
  }

  getStatusClass(status?: string): string {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'status-pill status-pill--success';
      case 'pending':
        return 'status-pill status-pill--pending';
      case 'canceled':
        return 'status-pill status-pill--danger';
      default:
        return 'status-pill';
    }
  }

  formatTicker(ticker?: string | null): string {
    return ticker || '—';
  }

  private getDateMinusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
  }
}
