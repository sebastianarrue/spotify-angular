import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/containers/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/containers/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/containers/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/songs/containers/song-list/song-list.component').then(m => m.SongListComponent)
      },
      {
        path: 'playlists',
        loadComponent: () => import('./features/playlists/containers/playlist-list/playlist-list.component').then(m => m.PlaylistListComponent)
      },
      {
        path: 'playlists/:id',
        loadComponent: () => import('./features/playlists/containers/playlist-detail/playlist-detail.component').then(m => m.PlaylistDetailComponent)
      },
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      }
    ]
  },
  {
    path: '**', redirectTo: 'dashboard'
  }
];
