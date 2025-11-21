import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const stored = (localStorage.getItem('theme') as ThemeMode) || 'light';
    this.applyTheme(stored);
  }

  toggleTheme(): void {
    const next = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.applyTheme(next);
  }

  private applyTheme(mode: ThemeMode): void {
    this.themeSubject.next(mode);
    localStorage.setItem('theme', mode);

    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
  }
}
