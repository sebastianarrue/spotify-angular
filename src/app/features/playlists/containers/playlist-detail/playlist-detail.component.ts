import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlaylistFacadeService } from '../../../../core/services/playlist.facade.service';
import { Playlist } from '../../../../core/models/playlist.model';
import { Song } from '../../../../core/models/song.model';
import { environment } from '../../../../../environments/environment';
import { LucideMusic, LucidePlay, LucideTrash2 } from '@lucide/angular';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [LucideMusic, LucideTrash2, LucidePlay, RouterLink],
  templateUrl: './playlist-detail.component.html',
})
export class PlaylistDetailComponent {
  private route = inject(ActivatedRoute);
  private playlistFacade = inject(PlaylistFacadeService);
  playlist = signal<Playlist | null>(null);
  songs = signal<Song[]>([]);
  apiUrl = environment.apiUrl;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.playlist.set(null);
        this.songs.set([]);
        return this.playlistFacade.getPlaylist(id!);
      })
    ).subscribe(res => {
      this.playlist.set(res.playlist);
      this.songs.set(res.songs);
    });
  }

  removeSong(songId: string) {
    const playlistId = this.playlist()?.id;
    if (playlistId && confirm('Remove this song from playlist?')) {
      this.playlistFacade.removeSongFromPlaylist(playlistId, songId).subscribe(() => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.playlistFacade.getPlaylist(id).subscribe(res => {
            this.playlist.set(res.playlist);
            this.songs.set(res.songs);
          });
        }
      });
    }
  }
}
