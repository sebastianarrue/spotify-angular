import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlaylistService } from '../../../core/services/playlist.service';
import { Playlist } from '../../../core/models/playlist.model';
import { Song } from '../../../core/models/song.model';
import { LucideMusic, LucideTrash2, LucidePlay } from '@lucide/angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [LucideMusic, LucideTrash2, LucidePlay, RouterLink],
  template: `
@if (playlist()) {
  <div>
    <div class="bg-linear-to-b from-indigo-900/60 via-[var(--spotify-dark-gray)] to-[var(--spotify-dark-gray)]">
      <div class="px-8 pt-24 pb-8">
        <div class="flex items-end gap-6">
          <div class="w-56 h-56 bg-linear-to-br from-indigo-800 to-indigo-600 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
            <svg lucideMusic class="w-24 h-24 text-white/60"></svg>
          </div>
          <div class="flex-1">
            <span class="text-xs uppercase font-bold tracking-widest text-white/70">Playlist</span>
            <h1 class="text-5xl font-bold mt-2 mb-4 leading-tight">{{ playlist()?.name }}</h1>
            @if (playlist()?.description) {
              <p class="text-sm text-[var(--spotify-lightest-gray)]">{{ playlist()?.description }}</p>
            }
            <p class="text-sm text-[var(--spotify-lightest-gray)] mt-1">{{ songs().length }} songs</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-8 pb-24">
      <div class="mt-4">
        <div class="grid grid-cols-[40px_1fr_1fr_40px] gap-0 text-xs uppercase tracking-wider text-[var(--spotify-lightest-gray)] font-bold border-b border-white/10 px-4 pb-2">
          <div class="text-right">#</div>
          <div class="pl-4">Title</div>
          <div>Album</div>
          <div></div>
        </div>
        
        @for (song of songs(); track song._id; let i = $index) {
          <div class="grid grid-cols-[40px_1fr_1fr_40px] gap-0 px-4 py-2 rounded hover:bg-white/10 group transition-colors items-center">
            <div class="text-right text-sm text-[var(--spotify-lightest-gray)]">
              <span class="group-hover:hidden">{{ i + 1 }}</span>
              <svg lucidePlay class="w-4 h-4 text-white hidden group-hover:block mx-auto"></svg>
            </div>
            <div class="flex items-center gap-3 pl-4">
              <img [src]="apiUrl + '/images/' + song.imageUrl" class="w-10 h-10 rounded object-cover">
              <div>
                <div class="text-sm font-medium text-white">{{ song.title }}</div>
                <div class="text-sm text-[var(--spotify-lightest-gray)]">{{ song.author }}</div>
              </div>
            </div>
            <div class="text-sm text-[var(--spotify-lightest-gray)]">{{ song.album }}</div>
            <div class="flex justify-end">
              <button (click)="removeSong(song._id)" class="text-[var(--spotify-lightest-gray)] hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1 cursor-pointer" title="Remove from playlist">
                <svg lucideTrash2 class="w-4 h-4"></svg>
              </button>
            </div>
          </div>
        }
        
        @if (songs().length === 0) {
          <div class="py-16 text-center">
            <p class="text-[var(--spotify-lightest-gray)] mb-2">This playlist is empty.</p>
            <a routerLink="/dashboard" class="text-sm font-bold text-white hover:text-[var(--spotify-green)] transition-colors underline underline-offset-2">Browse songs</a>
          </div>
        }
      </div>
    </div>
  </div>
} @else {
  <div class="min-h-screen flex items-center justify-center">
    <div class="flex items-center gap-3 text-[var(--spotify-lightest-gray)]">
      <div class="w-5 h-5 border-2 border-[var(--spotify-lightest-gray)] border-t-transparent rounded-full animate-spin"></div>
      <span class="text-sm">Loading playlist...</span>
    </div>
  </div>
}`
})
export class PlaylistDetailComponent {
  private route = inject(ActivatedRoute);
  private playlistService = inject(PlaylistService);
  
  playlist = signal<Playlist | null>(null);
  songs = signal<Song[]>([]);
  apiUrl = environment.apiUrl;

  ngOnInit() {
    this.loadPlaylist();
  }

  loadPlaylist() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.playlistService.getPlaylist(id).subscribe(res => {
        this.playlist.set(res.playlist);
        this.songs.set(res.songs);
      });
    }
  }

  removeSong(songId: string) {
    const playlistId = this.playlist()?.id;
    if (playlistId && confirm('Remove this song from playlist?')) {
      this.playlistService.removeSongFromPlaylist(playlistId, songId).subscribe(() => {
        this.loadPlaylist();
      });
    }
  }
}
