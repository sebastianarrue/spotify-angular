import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SongFacadeService } from './song.facade.service';
import { SongApiService } from './song-api.service';
import { Song } from '../../../core/models/song.model';

describe('SongFacadeService', () => {
  let service: SongFacadeService;
  let mockApi: Partial<Record<keyof SongApiService, ReturnType<typeof vi.fn>>>;

  const mockSongs: Song[] = [
    { _id: '1', title: 'Song A', album: 'Album A', author: 'Artist A', imageUrl: 'a.jpg' },
    { _id: '2', title: 'Song B', album: 'Album B', author: 'Artist B', imageUrl: 'b.jpg' },
  ];

  beforeEach(() => {
    mockApi = {
      getSongs: vi.fn(),
      createSong: vi.fn(),
      deleteSong: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SongApiService, useValue: mockApi },
        SongFacadeService,
      ],
    });
    service = TestBed.inject(SongFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty songs', () => {
    expect(service.songs()).toEqual([]);
  });

  describe('getSongs', () => {
    it('should update signal from api response with default page', () => {
      mockApi.getSongs!.mockReturnValue(of({
        message: 'ok', songs: mockSongs, totalItems: 2,
        currentPage: 1, hasNextPage: false, hasPreviousPage: false,
      }));
      service.getSongs().subscribe();
      expect(service.songs()).toEqual(mockSongs);
    });

    it('should pass page param to api', () => {
      mockApi.getSongs!.mockReturnValue(of({
        message: 'ok', songs: [], totalItems: 0,
        currentPage: 2, hasNextPage: false, hasPreviousPage: true,
      }));
      service.getSongs(2).subscribe();
      expect(mockApi.getSongs).toHaveBeenCalledWith(2);
    });
  });

  describe('createSong', () => {
    it('should call api and refresh songs', () => {
      const fd = new FormData();
      fd.append('title', 'New');
      mockApi.createSong!.mockReturnValue(of({}));
      mockApi.getSongs!.mockReturnValue(of({
        message: 'ok', songs: mockSongs, totalItems: 2,
        currentPage: 1, hasNextPage: false, hasPreviousPage: false,
      }));
      service.createSong(fd).subscribe();
      expect(mockApi.createSong).toHaveBeenCalledWith(fd);
      expect(mockApi.getSongs).toHaveBeenCalled();
    });
  });

  describe('deleteSong', () => {
    it('should call api and refresh songs', () => {
      mockApi.deleteSong!.mockReturnValue(of({}));
      mockApi.getSongs!.mockReturnValue(of({
        message: 'ok', songs: mockSongs, totalItems: 2,
        currentPage: 1, hasNextPage: false, hasPreviousPage: false,
      }));
      service.deleteSong('1').subscribe();
      expect(mockApi.deleteSong).toHaveBeenCalledWith('1');
      expect(mockApi.getSongs).toHaveBeenCalled();
    });
  });
});
