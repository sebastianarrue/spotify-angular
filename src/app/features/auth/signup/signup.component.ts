import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LucideMusic } from '@lucide/angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideMusic],
  template: `
<div class="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-zinc-900 to-black p-4">
  <div class="mb-10 flex items-center gap-2">
    <svg lucideMusic class="w-9 h-9 text-spotify-green"></svg>
    <h1 class="text-3xl font-bold text-white tracking-tight">Spotify</h1>
  </div>

  <div class="w-full max-w-sm">
    <h2 class="text-3xl font-bold mb-10 text-center text-white">Sign up to start listening</h2>
    
    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-300">Email address</label>
        <input 
          type="email" 
          formControlName="email" 
          class="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-sm text-white focus:border-spotify-green focus:ring-1 focus:ring-spotify-green outline-none transition-all placeholder:text-zinc-500" 
          placeholder="name@example.com"
        >
      </div>
      
      <div class="space-y-2">
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-300">Password</label>
        <input 
          type="password" 
          formControlName="password" 
          class="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-sm text-white focus:border-spotify-green focus:ring-1 focus:ring-spotify-green outline-none transition-all placeholder:text-zinc-500" 
          placeholder="Create a password"
        >
      </div>

      <button 
        type="submit" 
        [disabled]="signupForm.invalid" 
        class="w-full bg-spotify-green text-black font-bold p-3 rounded-full text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 mt-2 cursor-pointer"
      >
        Sign Up
      </button>
    </form>
    
    <div class="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-400">
      Already have an account? 
      <a routerLink="/login" class="text-white hover:text-spotify-green font-semibold underline underline-offset-4 decoration-zinc-600 hover:decoration-spotify-green transition-colors">
        Log in
      </a>
    </div>
  </div>
</div>`
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService.signup(email!, password!).subscribe({
        next: () => {
          alert('Account created! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => alert(err.error.message || 'Signup failed')
      });
    }
  }
}
