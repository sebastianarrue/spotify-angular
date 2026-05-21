import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { Playlist, PlaylistResponse } from '../models/playlist.model';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  playlists = toSignal(this.playlistsSubject);

  getPlaylists() {
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/playlists`).pipe(
      tap(res => this.playlistsSubject.next(res.playlists))
    );
  }

  getPlaylist(id: string) {
    return this.http.get<{ playlist: Playlist, songs: Song[] }>(`${this.apiUrl}/playlists/${id}`);
  }

  createPlaylist(name: string, description: string) {
    return this.http.post<any>(`${this.apiUrl}/playlists/create`, { name, description }).pipe(
      tap(() => this.getPlaylists().subscribe())
    );
  }

  addSongToPlaylist(playlistId: number, mongoSongId: string) {
    return this.http.post(`${this.apiUrl}/playlists/add-song`, { playlistId, mongoSongId });
  }

  removeSongFromPlaylist(playlistId: number, mongoSongId: string) {
    return this.http.delete(`${this.apiUrl}/playlists/remove-song`, { body: { playlistId, mongoSongId } });
  }

  deletePlaylist(id: number) {
    return this.http.delete(`${this.apiUrl}/playlists/delete/${id}`).pipe(
      tap(() => this.getPlaylists().subscribe())
    );
  }
}
