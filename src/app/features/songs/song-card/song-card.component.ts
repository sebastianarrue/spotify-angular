import { Component, input, output } from '@angular/core';
import { Song } from '../../../core/models/song.model';
import { LucidePlay, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [LucidePlay, LucidePlus, LucideTrash2],
  template: `
<div class="bg-[var(--spotify-card-gray)] p-4 rounded-md hover:bg-[var(--spotify-hover-gray)] transition-colors group cursor-pointer relative">
  <div class="relative mb-4">
    <img [src]="imageUrl" [alt]="song().title" class="w-full aspect-square object-cover rounded-md shadow-lg">
    <button class="absolute bottom-2 right-2 w-12 h-12 bg-[var(--spotify-green)] rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hover:scale-110 hover:bg-[#1ed760]">
      <svg lucidePlay class="w-6 h-6 text-black ml-0.5"></svg>
    </button>
  </div>
  <h3 class="font-bold text-sm truncate mb-0.5 text-white">{{ song().title }}</h3>
  <p class="text-sm text-[var(--spotify-lightest-gray)] truncate">{{ song().author }}</p>
  <div class="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
    <button (click)="addToPlaylist.emit(song())" class="p-1.5 bg-black/70 rounded-full hover:bg-black/90 hover:scale-105 transition-all cursor-pointer" title="Add to playlist">
      <svg lucidePlus class="w-3.5 h-3.5 text-white"></svg>
    </button>
    <button (click)="delete.emit(song()._id)" class="p-1.5 bg-black/70 rounded-full hover:bg-black/90 hover:text-red-400 hover:scale-105 transition-all cursor-pointer" title="Delete song">
      <svg lucideTrash2 class="w-3.5 h-3.5"></svg>
    </button>
  </div>
</div>`
})
export class SongCardComponent {
  song = input.required<Song>();
  addToPlaylist = output<Song>();
  delete = output<string>();

  get imageUrl() {
    return `${environment.apiUrl}/images/${this.song().imageUrl}`;
  }
}
