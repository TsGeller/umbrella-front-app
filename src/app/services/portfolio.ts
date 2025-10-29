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
          ([stockName, quantity]) => ({
            stockName,
            name: stockName,
            quantity: Number(quantity),
            ticker: stockName,
            price: 0, // par défaut, à mettre à jour si dispo
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

        // Récupérer la dernière donnée (la plus récente)
        const lastEntry = response.data[response.data.length - 1];
        const newPrice = parseFloat(lastEntry.close_euro);

        // Mettre à jour le portfolio centralisé
        const currentPortfolio = this.portfolioSubject.value;
        const updated = currentPortfolio.updatePriceOfTicker(ticker, newPrice);

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
  getPriceForTickerSpydde(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/stock_information/get_prices/?ticker=SPYD.DE&start_date=${this.getDateMinusDays(
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
