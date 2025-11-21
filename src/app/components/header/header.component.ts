import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  username: string | null = null;
  isLoggedIn = false;
  isProfileMenuOpen = false;
  isMobileMenuOpen = false;
  brandName = 'Umbrella';
  pageTitle = 'Dashboard';
  isDark = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const cached = this.authService.getCurrentUsername();
    if (cached) {
      this.username = cached;
      this.isLoggedIn = true;
    }

    // Vérifie si une session active existe côté backend
    this.authService.checkSession().subscribe();

    // Abonnement au flux utilisateur
    this.authService.currentUser$.subscribe((user) => {
      this.username = user;
      this.isLoggedIn = !!user;
    });

    this.themeService.theme$.subscribe((mode) => {
      this.isDark = mode === 'dark';
    });

    // Mise à jour du titre selon la route active
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setPageTitleFromUrl(event.urlAfterRedirects || event.url);
      });

    // init (cas où déjà sur une route)
    this.setPageTitleFromUrl(this.router.url);
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  get firstLetter(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }
  goHome() {
    this.router.navigate(['/home']);
  }
  goToLogin() {
    this.isMobileMenuOpen = false;
    this.isProfileMenuOpen = false;
    this.router.navigate(['/login']);
  }

  goToChangePassword(): void {
    this.isMobileMenuOpen = false;
    this.isProfileMenuOpen = false;
    this.router.navigate(['/change-password']);
  }

  goToSettings(): void {
    this.isMobileMenuOpen = false;
    this.isProfileMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout() {
    this.isProfileMenuOpen = false;
    this.isMobileMenuOpen = false;
    this.authService.logout();
    setTimeout(() => this.router.navigate(['/login']), 200); // petit délai
  }
  // 👇 Ferme le menu si on clique ailleurs
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  private setPageTitleFromUrl(url: string) {
    const clean = url.split('?')[0];
    if (clean.includes('/transactions')) {
      this.pageTitle = 'Transactions';
    } else if (clean.includes('/risk')) {
      this.pageTitle = 'Risk';
    } else if (clean.includes('/settings')) {
      this.pageTitle = 'Settings';
    } else if (clean.includes('/home') || clean.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else {
      this.pageTitle = 'Dashboard';
    }
  }
}
