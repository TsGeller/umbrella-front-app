// services/portfolio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Portfolio } from '../models/portfolio.model';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private baseUrl = 'http://51.21.224.128:8000';

  private portfolioSubject = new BehaviorSubject<Portfolio>(new Portfolio());
  portfolio$ = this.portfolioSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getDateMinusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  getPortfolio(): Observable<any> {
    return this.http
      .get(
        `${
          this.baseUrl
        }/portfolio_valuation/get_daily_portfolio_snapshot/?start_date=${this.getDateMinusDays(
          180
        )}&end_date=${this.getDateMinusDays(1)}`
      )
      .pipe(
        map((data) => data),
        catchError((error) => {
          console.error('Erreur de récupération :', error);
          return of(null); // ou renvoyer une valeur simulée
        })
      );
  }
  getPortfolioUsers(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users/get_portfolio_users`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          console.error('Erreur de récupération des propriétaires :', error);
          return of(null);
        })
      );
  }
  getValueForUser(id: number): Observable<any> {
    return this.http
      .get(
        `${
          this.baseUrl
        }/portfolio_valuation/user_snapshots/?user_id=${id}&start_date=${this.getDateMinusDays(
          180
        )}&end_date=${this.getDateMinusDays(1)}`
      )
      .pipe(
        map((data) => data),
        catchError((error) => {
          console.error('Erreur de récupération :', error);
          return of(null);
        })
      );
  }
  loadStockHoldings(): void {
    this.http
      .get<any>(`${this.baseUrl}/portfolio_valuation/get_portfolio_stocks/`)
      .pipe(
        catchError((error) => {
          console.error('Erreur de récupération :', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        const data = response?.data || {};

        // transformer les holdings en Stock[]
        const holdings: Stock[] = Object.entries(data).map(
          ([ticker, quantity]) => ({
            ticker,
            name: '',
            quantity: Number(quantity),
            price: 0, // par défaut, à mettre à jour si dispo
            pnl: 0,
          })
        );

        // mettre à jour le portfolio centralisé
        const currentPortfolio = this.portfolioSubject.value;
        currentPortfolio.setStockComposition(holdings);

        // notifier tous les abonnés
        this.portfolioSubject.next(currentPortfolio);
        // Optionnel : charger les prix pour chaque ticker
        holdings.forEach((stock) => {
          this.getPriceForTicker(stock.ticker);
          this.getCompanyInfo(stock.ticker);
        });
      });
  }
  getPriceForTicker(ticker: string): void {
    this.http
      .get<any>(
        `${
          this.baseUrl
        }/stock_information/get_prices/?ticker=${ticker}&start_date=${this.getDateMinusDays(
          180
        )}&end_date=${this.getDateMinusDays(1)}`
      )
      .pipe(
        catchError((error) => {
          console.error('Erreur de récupération :', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (!response || !response.data) {
          console.error('Pas de données disponibles pour', ticker);
          return;
        }

        const lastEntry = response.data[response.data.length - 1];
        const firstEntry = response.data[0];
        const newPrice = parseFloat(lastEntry?.close_euro);
        const basePrice = parseFloat(firstEntry?.close_euro);

        if (isNaN(newPrice)) {
          console.warn(`Prix invalide pour ${ticker}`);
          return;
        }

        // Mettre à jour le portfolio centralisé
        const currentPortfolio = this.portfolioSubject.value;
        const currentStock = currentPortfolio
          .getStcokComposition()
          .find((s) => s.ticker === ticker);
        const quantity = currentStock?.quantity ?? 0;
        const pnlValue =
          !isNaN(basePrice) && quantity
            ? (newPrice - basePrice) * quantity
            : 0;

        const updated = currentPortfolio.updatePriceOfTicker(
          ticker,
          newPrice,
          pnlValue
        );

        if (!updated) {
          console.warn(
            `Le ticker ${ticker} n'existe pas dans le portfolio, mise à jour ignorée.`
          );
          return;
        }

        // Notifier les abonnés uniquement si mise à jour réussie
        this.portfolioSubject.next(currentPortfolio);
      });
  }
  getCompanyInfo(ticker: string): void {
    this.http
      .get<any>(
        `${this.baseUrl}/stock_information/get_company_info/?ticker=${ticker}`
      )
      .pipe(
        catchError((error) => {
          console.error('Erreur de récupération :', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        const companyName =
          response?.data?.company_name ||
          response?.data?.name ||
          response?.company_name ||
          response?.name;

        if (!companyName) {
          console.warn(`Nom introuvable pour ${ticker}`);
          return;
        }

        const currentPortfolio = this.portfolioSubject.value;
        const updated =
          currentPortfolio.updateNameOfTicker(ticker, companyName);

        if (updated) {
          this.portfolioSubject.next(currentPortfolio);
        }
      });
  }
  getPriceForTickerSpydde(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/stock_information/get_prices/?ticker=SPY&start_date=${this.getDateMinusDays(
          180
        )}&end_date=${this.getDateMinusDays(1)}`)
      .pipe(
        catchError((error) => {
          console.error('Erreur de récupération :', error);
          return of(null);
        }),
        map((response) => {
          if (!response || !response.data) {
            console.error('Pas de données disponibles pour SPYD.DE');
            return null;
          }
          console.log('Données SPYD.DE reçues :', response.data);
          return response.data;
        })
      );
  }

  // Exemple pour simuler en attendant l’API
  getMockPortfolio(id: string): Observable<any> {
    const mockData = {
      id: '1',
      name: 'Umbrella',
      total: 12345.67,
      assets: [
        { name: 'AAPL', value: 5000 },
        { name: 'GOOGL', value: 7345.67 },
      ],
    };
    return of(mockData);
  }
}
