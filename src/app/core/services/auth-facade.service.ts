import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private api = inject(AuthApiService);
  private router = inject(Router);

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
    return this.api.login(email, password).pipe(
      tap(res => {
        localStorage.setItem('spotify_user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      })
    );
  }

  signup(email: string, password: string) {
    return this.api.signup(email, password);
  }

  logout() {
    return this.api.logout().pipe(
      tap(() => {
        localStorage.removeItem('spotify_user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }
}
