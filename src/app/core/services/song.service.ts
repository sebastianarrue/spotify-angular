import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { Song, SongResponse } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private songsSubject = new BehaviorSubject<Song[]>([]);
  songs = toSignal(this.songsSubject);

  getSongs(page: number = 1) {
    return this.http.get<SongResponse>(`${this.apiUrl}/songs?page=${page}`).pipe(
      tap(res => this.songsSubject.next(res.songs))
    );
  }

  createSong(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/songs/create`, formData).pipe(
      tap(() => this.getSongs().subscribe())
    );
  }

  deleteSong(id: string) {
    return this.http.delete(`${this.apiUrl}/songs/delete/${id}`).pipe(
      tap(() => this.getSongs().subscribe())
    );
  }
}
