import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  username = "Anon";
  isLoggedIn = false;
  isProfileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef) {}

  ngOnInit(): void {
    const existingUser = this.authService.getCurrentUsername();
    if (existingUser) {
      this.username = existingUser;
      this.isLoggedIn = true;
    }

    this.authService.checkSession().subscribe();

    this.authService.currentUser$.subscribe((user) => {
      this.username = user ?? "Anon";
      this.isLoggedIn = !!user;
    });
  }
  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  get firstLetter(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }
  goToLogin(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    this.authService.logout();
    setTimeout(() => this.router.navigate(['/login']), 200);
  }
  // 👇 Ferme le menu si on clique ailleurs
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }
}
