import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Transaction {
  id: number;
  date: string;
  type: string;
  ticker?: string | null;
  shares?: number | null;
  amount: number;
  currency?: string | null;
  metadata?: Record<string, unknown>;
  user?: number | null;
  status?: string;
}

interface TransactionResponse {
  status?: string;
  data?: Transaction[];
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly baseUrl = 'http://51.21.224.128:8000';

  constructor(private http: HttpClient) {}

  getTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    ticker?: string;
    userId?: number;
    id?: number;
  }): Observable<Transaction[]> {
    const url = `${this.baseUrl}/transactions/get_transaction/`;
    let params = new HttpParams();
    if (filters?.startDate) params = params.set('start_date', filters.startDate);
    if (filters?.endDate) params = params.set('end_date', filters.endDate);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.ticker) params = params.set('ticker', filters.ticker);
    if (filters?.userId) params = params.set('user_id', filters.userId);
    if (filters?.id) params = params.set('id', filters.id);

    return this.http.get<TransactionResponse>(url, { withCredentials: true, params }).pipe(
      map(res =>
        (res?.data ?? []).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      ),
      catchError(() => of(this.mockTransactions))
    );
  }

  private get mockTransactions(): Transaction[] {
    return [
      { id: 1, date: '2024-10-02', type: 'deposit', ticker: null, shares: null, amount: 2100, currency: 'EUR', status: 'completed' },
      { id: 2, date: '2024-10-04', type: 'fee', ticker: null, shares: null, amount: -1.34, currency: 'EUR', status: 'completed' },
      { id: 3, date: '2024-10-10', type: 'buy', ticker: 'SPYD.DE', shares: 20, amount: -720.4, currency: 'EUR', status: 'pending' }
    ];
  }
}
