import { Component, inject, signal } from '@angular/core';
import { PlaylistService } from '../../../core/services/playlist.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideTrash2, LucideMusic } from '@lucide/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [ReactiveFormsModule, LucideTrash2, LucideMusic, RouterLink],
  template: `
<div class="px-8 pt-24 pb-24 space-y-8">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold">Your Playlists</h1>
    <button (click)="showCreateForm.set(!showCreateForm())" class="bg-[var(--spotify-green)] text-black font-bold px-6 py-2.5 rounded-full text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer">
      {{ showCreateForm() ? 'Cancel' : 'Create Playlist' }}
    </button>
  </div>
  
  @if (showCreateForm()) {
    <div class="bg-[var(--spotify-card-gray)] p-6 rounded-lg animate-[slide-up_0.2s_ease-out]">
      <form [formGroup]="playlistForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-[var(--spotify-lightest-gray)]">Name</label>
          <input formControlName="name" class="w-full bg-[var(--spotify-dark-gray)] border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-[var(--spotify-green)] transition-colors placeholder:text-[var(--spotify-lightest-gray)]" placeholder="My playlist">
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-[var(--spotify-lightest-gray)]">Description</label>
          <textarea formControlName="description" class="w-full bg-[var(--spotify-dark-gray)] border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-[var(--spotify-green)] transition-colors placeholder:text-[var(--spotify-lightest-gray)]" placeholder="Optional description" rows="3"></textarea>
        </div>
        <button type="submit" [disabled]="playlistForm.invalid" class="bg-[var(--spotify-green)] text-black font-bold px-8 py-2.5 rounded-full text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer">Create</button>
      </form>
    </div>
  }
  
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
    @for (playlist of playlistService.playlists() || []; track playlist.id) {
      <a [routerLink]="['/playlists', playlist.id]" class="bg-[var(--spotify-card-gray)] p-4 rounded-md hover:bg-[var(--spotify-hover-gray)] transition-colors group cursor-pointer block">
        <div class="w-full aspect-square bg-linear-to-br from-gray-700 to-gray-900 rounded-md flex items-center justify-center mb-4 shadow-lg">
          <svg lucideMusic class="w-14 h-14 text-[var(--spotify-lightest-gray)] opacity-60"></svg>
        </div>
        <h3 class="font-bold text-sm truncate mb-0.5 text-white">{{ playlist.name }}</h3>
        <div class="flex items-center justify-between">
          <p class="text-sm text-[var(--spotify-lightest-gray)] truncate flex-1">{{ playlist.description || playlistService.playlists()?.length + ' songs' || 'No description' }}</p>
          <button (click)="$event.preventDefault(); $event.stopPropagation(); onDelete(playlist.id)" class="p-1.5 text-[var(--spotify-lightest-gray)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" title="Delete playlist">
            <svg lucideTrash2 class="w-4 h-4"></svg>
          </button>
        </div>
      </a>
    }
  </div>
</div>`
})
export class PlaylistListComponent {
  playlistService = inject(PlaylistService);
  private fb = inject(FormBuilder);
  
  showCreateForm = signal(false);

  playlistForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  ngOnInit() {
    this.playlistService.getPlaylists().subscribe();
  }

  onSubmit() {
    if (this.playlistForm.valid) {
      const { name, description } = this.playlistForm.value;
      this.playlistService.createPlaylist(name!, description || '').subscribe(() => {
        this.showCreateForm.set(false);
        this.playlistForm.reset();
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Delete this playlist?')) {
      this.playlistService.deletePlaylist(id).subscribe();
    }
  }
}
