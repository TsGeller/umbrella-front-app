// services/portfolio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl = 'https://api.example.com'; // Remplace plus tard

  constructor(private http: HttpClient) {}

  // Exemple : obtenir l'état d'un portfolio
  getPortfolio(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/portfolio/${id}`).pipe(
      map(data => data),
      catchError(error => {
        console.error('Erreur de récupération :', error);
        return of(null); // ou renvoyer une valeur simulée
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
        { name: 'GOOGL', value: 7345.67 }
      ]
    };
    return of(mockData);
  }
}
