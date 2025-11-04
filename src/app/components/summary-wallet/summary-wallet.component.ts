import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-summary-wallet',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  templateUrl: './summary-wallet.html',
  styleUrls: ['./summary-wallet.scss'],
})
export class SummaryWallet implements OnInit {
  walletValue: number = 0;
  dailyPnL: number = 0;
  pnlPercentage: number = 0;
  hasPnL: boolean = false;
  userOwnedValue: number | null = null;
  userOwnedPercentage: number | null = null;
  ownershipLoading = false;
  ownershipError = '';

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe((response: any) => {
      const data = response?.data;
      if (!Array.isArray(data) || data.length < 2) {
        console.error('Pas assez de données pour calculer le PnL');
        return;
      }

      // Dernière et avant-dernière valeurs
      const latest = parseFloat(data[data.length - 1].total_value);
      const previous = parseFloat(data[data.length - 2].total_value);

      if (isNaN(latest) || isNaN(previous)) return;

      this.walletValue = latest;
      this.dailyPnL = latest - previous;
      this.pnlPercentage = ((latest - previous) / previous) * 100;
      this.hasPnL = true;
      this.computeOwnershipPercentage();
      this.loadUserOwnership();
    });
  }

  private loadUserOwnership(): void {
    const username = this.authService.getCurrentUsername();
    if (!username) {
      this.ownershipLoading = false;
      this.userOwnedValue = null;
      this.userOwnedPercentage = null;
      this.ownershipError = 'Sign in required to view ownership details.';
      return;
    }

    this.ownershipLoading = true;
    this.ownershipError = '';

    this.portfolioService.getPortfolioUsers().subscribe({
      next: (response: any) => {
        const data = response?.data;
        if (!data) {
          this.handleOwnershipError('Données indisponibles pour vos positions.');
          return;
        }

        const entries = Object.entries(data as Record<string, any>);
        const entry = entries.find(([, user]) => user.username === username);

        if (!entry) {
          this.handleOwnershipError('Aucune position associée à votre compte.');
          return;
        }

        const userId = Number(entry[0]);
        if (Number.isNaN(userId)) {
          this.handleOwnershipError('Identifiant utilisateur invalide.');
          return;
        }

        this.portfolioService.getValueForUser(userId).subscribe({
          next: (userResponse: any) => {
            const snapshots = userResponse?.data;
            if (!Array.isArray(snapshots) || snapshots.length === 0) {
              this.handleOwnershipError('Aucun historique trouvé pour vos positions.');
              return;
            }

            const latestSnapshot = snapshots[snapshots.length - 1];
            const rawValue = parseFloat(
              latestSnapshot?.value_held ??
              latestSnapshot?.total_value ??
              '0'
            );

            if (Number.isNaN(rawValue)) {
              this.handleOwnershipError('Valeur de position introuvable.');
              return;
            }

            this.userOwnedValue = rawValue;
            this.ownershipLoading = false;
            this.ownershipError = '';
            this.computeOwnershipPercentage();
          },
          error: () => this.handleOwnershipError('Erreur lors de la récupération de vos positions.'),
        });
      },
      error: () => this.handleOwnershipError('Impossible de charger les propriétaires du portefeuille.'),
    });
  }

  private computeOwnershipPercentage(): void {
    if (this.walletValue > 0 && this.userOwnedValue !== null) {
      this.userOwnedPercentage = (this.userOwnedValue / this.walletValue) * 100;
    } else {
      this.userOwnedPercentage = null;
    }
  }

  private handleOwnershipError(message: string): void {
    this.userOwnedValue = null;
    this.userOwnedPercentage = null;
    this.ownershipLoading = false;
    this.ownershipError = message;
  }
}
