import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar implements OnInit {
  username: string | null = null;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const cached = this.authService.getCurrentUsername();
    if (cached) {
      this.username = cached;
    }

    this.authService.currentUser$.subscribe((user) => {
      this.username = user;
    });
  }

  get firstLetter(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'U';
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
