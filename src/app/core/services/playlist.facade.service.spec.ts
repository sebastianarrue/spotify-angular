import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PlaylistFacadeService } from './playlist.facade.service';
import { PlaylistApiService } from './playlist-api.service';
import { Playlist } from '../models/playlist.model';
import { Song } from '../models/song.model';

describe('PlaylistFacadeService', () => {
  let service: PlaylistFacadeService;
  let mockApi: Partial<Record<keyof PlaylistApiService, ReturnType<typeof vi.fn>>>;

  const mockPlaylists: Playlist[] = [
    { id: 1, name: 'P1', description: 'D1', userId: 1 },
    { id: 2, name: 'P2', description: 'D2', userId: 1 },
  ];

  const mockPlaylistDetail = {
    playlist: mockPlaylists[0],
    songs: [] as Song[],
  };

  beforeEach(() => {
    mockApi = {
      getPlaylists: vi.fn(),
      getPlaylist: vi.fn(),
      createPlaylist: vi.fn(),
      addSongToPlaylist: vi.fn(),
      removeSongFromPlaylist: vi.fn(),
      deletePlaylist: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PlaylistApiService, useValue: mockApi },
        PlaylistFacadeService,
      ],
    });
    service = TestBed.inject(PlaylistFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty playlists', () => {
    expect(service.playlists()).toEqual([]);
  });

  describe('getPlaylists', () => {
    it('should update signal from api response', () => {
      mockApi.getPlaylists!.mockReturnValue(of({ playlists: mockPlaylists }));
      service.getPlaylists().subscribe();
      expect(service.playlists()).toEqual(mockPlaylists);
    });
  });

  describe('getPlaylist', () => {
    it('should delegate to api', () => {
      mockApi.getPlaylist!.mockReturnValue(of(mockPlaylistDetail));
      service.getPlaylist('1').subscribe(res => {
        expect(res).toEqual(mockPlaylistDetail);
      });
      expect(mockApi.getPlaylist).toHaveBeenCalledWith('1');
    });
  });

  describe('createPlaylist', () => {
    it('should call api and refresh playlists', () => {
      mockApi.createPlaylist!.mockReturnValue(of({}));
      mockApi.getPlaylists!.mockReturnValue(of({ playlists: mockPlaylists }));
      service.createPlaylist('New', 'Desc').subscribe();
      expect(mockApi.createPlaylist).toHaveBeenCalledWith('New', 'Desc');
      expect(mockApi.getPlaylists).toHaveBeenCalled();
    });
  });

  describe('addSongToPlaylist', () => {
    it('should delegate to api', () => {
      mockApi.addSongToPlaylist!.mockReturnValue(of({}));
      service.addSongToPlaylist(1, 'abc123').subscribe();
      expect(mockApi.addSongToPlaylist).toHaveBeenCalledWith(1, 'abc123');
    });
  });

  describe('removeSongFromPlaylist', () => {
    it('should delegate to api', () => {
      mockApi.removeSongFromPlaylist!.mockReturnValue(of({}));
      service.removeSongFromPlaylist(1, 'abc123').subscribe();
      expect(mockApi.removeSongFromPlaylist).toHaveBeenCalledWith(1, 'abc123');
    });
  });

  describe('deletePlaylist', () => {
    it('should call api and refresh playlists', () => {
      mockApi.deletePlaylist!.mockReturnValue(of({}));
      mockApi.getPlaylists!.mockReturnValue(of({ playlists: mockPlaylists }));
      service.deletePlaylist(1).subscribe();
      expect(mockApi.deletePlaylist).toHaveBeenCalledWith(1);
      expect(mockApi.getPlaylists).toHaveBeenCalled();
    });
  });
});
