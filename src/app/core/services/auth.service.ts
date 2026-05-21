import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser = toSignal(this.userSubject);

  private loadUser(): User | null {
    const stored = localStorage.getItem('spotify_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem('spotify_user');
      }
    }
    return null;
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('spotify_user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      })
    );
  }

  signup(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/signup`, { email, password });
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('spotify_user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }
}
