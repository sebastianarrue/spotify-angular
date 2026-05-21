import { Component, input, output } from '@angular/core';
import { Song } from '../../../core/models/song.model';
import { LucidePlay, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [LucidePlay, LucidePlus, LucideTrash2],
  templateUrl: './song-card.component.html',
})
export class SongCardComponent {
  song = input.required<Song>();
  addToPlaylist = output<Song>();
  delete = output<string>();

  get imageUrl() {
    return `${environment.apiUrl}/images/${this.song().imageUrl}`;
  }
}
