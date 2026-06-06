import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SongResponse } from '../../../core/models/song.model';

@Injectable({ providedIn: 'root' })
export class SongApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSongs(page: number = 1): Observable<SongResponse> {
    return this.http.get<SongResponse>(`${this.apiUrl}/songs?page=${page}`);
  }

  createSong(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/songs/create`, formData);
  }

  deleteSong(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/songs/delete/${id}`);
  }
}
