import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://51.21.224.128:8000'; // Ton backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log("Attempting login with", username, password);
    return this.http.post(`${this.apiUrl}/users/login_user/`, { username, password });
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}