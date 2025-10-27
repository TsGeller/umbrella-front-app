import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://51.21.224.128:8000'; // Ton backend
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private readonly storageKey = 'username';

  constructor(private http: HttpClient) {
    // 🔹 Vérifie si une session est déjà active côté backend
    this.checkSession().subscribe();
  }

  /** 🔐 Connexion */
  login(username: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/users/login_user/`,
        { username, password },
        { withCredentials: true } // 👈 important pour envoyer/recevoir le cookie
      )
      .pipe(
        tap(() => {
          this.currentUserSubject.next(username);
          localStorage.setItem(this.storageKey, username);
        })
      );
  }

  /** 🆕 Création de compte */
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/add_user/`, payload, {
      withCredentials: true,
    });
  }

  /** 🔍 Vérifie si la session est encore active */
  checkSession(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/users/check_session/`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response?.username) {
            this.currentUserSubject.next(response.username);
            localStorage.setItem(this.storageKey, response.username);
          } else {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
              this.currentUserSubject.next(stored);
            } else {
              this.resetSession();
            }
          }
        }),
        catchError(() => {
          const stored = localStorage.getItem(this.storageKey);
          if (stored) {
            this.currentUserSubject.next(stored);
          } else {
            this.resetSession();
          }
          return of(null);
        })
      );
  }

  /** 🔓 Déconnexion */
  logout(): void {
    this.http
      .post(`${this.apiUrl}/users/logout_user/`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.resetSession(),
        error: () => this.resetSession()
      });
  }

  /** 👤 Retourne le nom de l’utilisateur connecté */
  getCurrentUsername(): string | null {
    return this.currentUserSubject.value || localStorage.getItem(this.storageKey);
  }

  /** 🟢 Vérifie s’il y a un utilisateur connecté */
  isLoggedIn(): boolean {
    return !!this.getCurrentUsername();
  }

  private resetSession(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.storageKey);
  }
}
