import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PlaylistApiService } from './playlist-api.service';
import { environment } from '../../../environments/environment';
import { Playlist, PlaylistResponse } from '../models/playlist.model';
import { Song } from '../models/song.model';

describe('PlaylistApiService', () => {
  let service: PlaylistApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PlaylistApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPlaylists', () => {
    it('should send a GET request to /playlists', () => {
      const mockResponse: PlaylistResponse = {
        playlists: [
          { id: 1, name: 'Favorites', description: 'My favs', userId: 1 },
        ],
      };

      service.getPlaylists().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/playlists`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getPlaylist', () => {
    it('should send a GET request to /playlists/:id', () => {
      const id = '5';
      const mockPlaylist: Playlist = { id: 5, name: 'Chill', description: 'Relax', userId: 1 };
      const mockSongs: Song[] = [
        { _id: 'abc', title: 'Song A', album: 'Album A', author: 'Artist A', imageUrl: 'a.jpg' },
      ];
      const mockResponse = { playlist: mockPlaylist, songs: mockSongs };

      service.getPlaylist(id).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/playlists/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createPlaylist', () => {
    it('should send a POST request to /playlists/create with name and description', () => {
      const name = 'New List';
      const description = 'A new playlist';

      service.createPlaylist(name, description).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/playlists/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name, description });
      req.flush({});
    });
  });

  describe('addSongToPlaylist', () => {
    it('should send a POST request to /playlists/add-song with playlistId and mongoSongId', () => {
      const playlistId = 1;
      const mongoSongId = 'abc123';

      service.addSongToPlaylist(playlistId, mongoSongId).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/playlists/add-song`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ playlistId, mongoSongId });
      req.flush({});
    });
  });

  describe('removeSongFromPlaylist', () => {
    it('should send a DELETE request to /playlists/remove-song with body', () => {
      const playlistId = 1;
      const mongoSongId = 'abc123';

      service.removeSongFromPlaylist(playlistId, mongoSongId).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/playlists/remove-song`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ playlistId, mongoSongId });
      req.flush({});
    });
  });

  describe('deletePlaylist', () => {
    it('should send a DELETE request to /playlists/delete/:id', () => {
      const id = 42;

      service.deletePlaylist(id).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/playlists/delete/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
