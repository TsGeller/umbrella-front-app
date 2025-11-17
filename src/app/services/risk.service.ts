import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface RiskMetricResponse {
  status: string;
  data: RiskMetric[];
}

export interface RiskMetric {
  id: number;
  date: string;
  volatility: number;
  drawdown: number;
  max_drawdown: number;
  VaR_95_1d: number;
  VaR_95_1d_amount: number;
  VaR_99_1d: number;
  VaR_99_1d_amount: number;
  CVaR_95_1d: number;
  CVaR_95_1d_amount: number;
  CVaR_99_1d: number;
  CVaR_99_1d_amount: number;
}

@Injectable({ providedIn: 'root' })
export class RiskService {
  private readonly baseUrl = 'http://51.21.224.128:8000';

  constructor(private http: HttpClient) {}

  getPortfolioRiskMetrics(startDate: string): Observable<RiskMetric[]> {
    const url = `${this.baseUrl}/risk_management/get_portfolio_risk_metrics/?start_date=${startDate}`;
    return this.http.get<RiskMetricResponse>(url, { withCredentials: true }).pipe(map(res => res.data || []));
  }
}
