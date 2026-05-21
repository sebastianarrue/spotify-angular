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
  templateUrl: './playlist-detail.component.html',
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
