import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Song } from '../../../core/models/song.model';
import { SongApiService } from './song-api.service';

@Injectable({ providedIn: 'root' })
export class SongFacadeService {
  private api = inject(SongApiService);

  private songsSubject = new BehaviorSubject<Song[]>([]);
  songs = toSignal(this.songsSubject);

  getSongs(page: number = 1) {
    return this.api.getSongs(page).pipe(
      tap(res => this.songsSubject.next(res.songs))
    );
  }

  createSong(formData: FormData) {
    return this.api.createSong(formData).pipe(
      tap(() => this.getSongs().subscribe())
    );
  }

  deleteSong(id: string) {
    return this.api.deleteSong(id).pipe(
      tap(() => this.getSongs().subscribe())
    );
  }
}
