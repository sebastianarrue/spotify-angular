import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SongApiService } from './song-api.service';
import { environment } from '../../../../environments/environment';
import { SongResponse } from '../../../core/models/song.model';

describe('SongApiService', () => {
  let service: SongApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SongApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSongs', () => {
    it('should send a GET request to /songs?page= with the given page', () => {
      const page = 2;
      const mockResponse: SongResponse = {
        message: 'Songs fetched',
        songs: [
          { _id: '1', title: 'Test Song', album: 'Album', author: 'Artist', imageUrl: 'img.jpg' },
        ],
        totalItems: 1,
        currentPage: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      };

      service.getSongs(page).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/songs?page=${page}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should default to page 1', () => {
      service.getSongs().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/songs?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush({ message: '', songs: [], totalItems: 0, currentPage: 1, hasNextPage: false, hasPreviousPage: false });
    });
  });

  describe('createSong', () => {
    it('should send a POST request to /songs/create with FormData', () => {
      const formData = new FormData();
      formData.append('title', 'New Song');

      service.createSong(formData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/songs/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(formData);
      req.flush({});
    });
  });

  describe('deleteSong', () => {
    it('should send a DELETE request to /songs/delete/:id', () => {
      const id = 'abc123';

      service.deleteSong(id).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/songs/delete/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
