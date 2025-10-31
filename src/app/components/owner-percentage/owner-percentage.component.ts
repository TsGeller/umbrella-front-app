import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  value?: number;
}

@Component({
  selector: 'app-owner-percentage',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './owner-percentage.html',
  styleUrls: ['./owner-percentage.scss'],
})
export class OwnerPercentage implements OnInit {
  users: User[] = [];
  total_value = 0;

  constructor(
    private portfolioService: PortfolioService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<any>('http://51.21.224.128:8000/users/get_portfolio_users')
      .subscribe({
        next: (response) => {
          const data = response?.data || {};
          const usersArray: User[] = Object.entries(data).map(([id, u]: any) => ({
            id: +id,
            first_name: u.first_name,
            last_name: u.last_name,
            username: u.username
          }));

          // Charger les valeurs pour chaque user en parallèle
          const valueRequests = usersArray.map(user =>
            this.portfolioService.getValueForUser(user.id)
          );

          forkJoin(valueRequests).subscribe({
            next: (responses: any[]) => {
              usersArray.forEach((user, index) => {
                const data = responses[index]?.data;
                if (Array.isArray(data) && data.length > 0) {
                  const lastSnapshot = data[data.length - 1];
                  user.value = lastSnapshot.value_held ?? 0;
                }
              });

              // Garder seulement ceux qui ont une valeur
              this.users = usersArray.filter(u => u.value && u.value > 0);
              this.computeTotal();
            },
            error: (err) => console.error('Erreur lors du chargement des valeurs :', err)
          });
        },
        error: (err) => console.error('Erreur lors du chargement des utilisateurs :', err)
      });
  }

  private computeTotal(): void {
    this.total_value = this.users.reduce((sum, u) => sum + (u.value ?? 0), 0);
  }

  getPercentage(user: User): number {
    if (!this.total_value) return 0;
    return ((user.value ?? 0) / this.total_value) * 100;
  }
}
