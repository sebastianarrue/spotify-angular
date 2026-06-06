import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Playlist, PlaylistResponse } from '../models/playlist.model';
import { Song } from '../models/song.model';

@Injectable({ providedIn: 'root' })
export class PlaylistApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPlaylists(): Observable<PlaylistResponse> {
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/playlists`);
  }

  getPlaylist(id: string): Observable<{ playlist: Playlist; songs: Song[] }> {
    return this.http.get<{ playlist: Playlist; songs: Song[] }>(`${this.apiUrl}/playlists/${id}`);
  }

  createPlaylist(name: string, description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/playlists/create`, { name, description });
  }

  addSongToPlaylist(playlistId: number, mongoSongId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/playlists/add-song`, { playlistId, mongoSongId });
  }

  removeSongFromPlaylist(playlistId: number, mongoSongId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/playlists/remove-song`, { body: { playlistId, mongoSongId } });
  }

  deletePlaylist(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/playlists/delete/${id}`);
  }
}
