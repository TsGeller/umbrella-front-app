import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  username: string | null = null;
  isLoggedIn = false;
  isProfileMenuOpen = false;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef) {}

 ngOnInit(): void {
  // Vérifie si une session active existe côté backend
  this.authService.checkSession().subscribe();

  // Abonnement au flux utilisateur
  this.authService.currentUser$.subscribe((user) => {
    this.username = user;
    this.isLoggedIn = !!user;
  });
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
  goToLogin() {
  this.isMobileMenuOpen = false;
  this.isProfileMenuOpen = false;
  this.router.navigate(['/login']);
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
}
