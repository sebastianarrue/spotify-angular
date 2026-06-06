import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Playlist } from '../models/playlist.model';
import { Song } from '../models/song.model';
import { PlaylistApiService } from './playlist-api.service';

@Injectable({ providedIn: 'root' })
export class PlaylistFacadeService {
  private api = inject(PlaylistApiService);

  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  playlists = toSignal(this.playlistsSubject);

  getPlaylists() {
    return this.api.getPlaylists().pipe(
      tap(res => this.playlistsSubject.next(res.playlists))
    );
  }

  getPlaylist(id: string) {
    return this.api.getPlaylist(id);
  }

  createPlaylist(name: string, description: string) {
    return this.api.createPlaylist(name, description).pipe(
      tap(() => this.getPlaylists().subscribe())
    );
  }

  addSongToPlaylist(playlistId: number, mongoSongId: string) {
    return this.api.addSongToPlaylist(playlistId, mongoSongId);
  }

  removeSongFromPlaylist(playlistId: number, mongoSongId: string) {
    return this.api.removeSongFromPlaylist(playlistId, mongoSongId);
  }

  deletePlaylist(id: number) {
    return this.api.deletePlaylist(id).pipe(
      tap(() => this.getPlaylists().subscribe())
    );
  }
}
