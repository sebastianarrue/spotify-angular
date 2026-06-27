import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { PlaylistFacadeService } from '../../../../core/services/playlist.facade.service';
import { LucideMusic, LucidePlay, LucideTrash2 } from '@lucide/angular';
import { RouterLink } from '@angular/router';

describe('PlaylistDetailComponent', () => {
  let mockPlaylistFacade: any;
  let mockRoute: any;

  const mockPlaylist = { id: 1, name: 'Test', description: 'Desc', userId: 1 };
  const mockSongs = [{ _id: 's1', title: 'Song', album: 'A', author: 'Ar', imageUrl: 'i.jpg' }];

  beforeEach(async () => {
    mockPlaylistFacade = {
      getPlaylist: vi.fn().mockReturnValue(of({ playlist: mockPlaylist, songs: mockSongs })),
      removeSongFromPlaylist: vi.fn().mockReturnValue(of({})),
    };
    mockRoute = {
      paramMap: of({ get: (key: string) => (key === 'id' ? '1' : null) }),
      snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '1' : null) } },
    };

    await TestBed.configureTestingModule({
      imports: [LucideMusic, LucidePlay, LucideTrash2, RouterLink, PlaylistDetailComponent],
      providers: [
        { provide: PlaylistFacadeService, useValue: mockPlaylistFacade },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PlaylistDetailComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load playlist on init', () => {
    const fixture = TestBed.createComponent(PlaylistDetailComponent);
    fixture.detectChanges();
    expect(mockPlaylistFacade.getPlaylist).toHaveBeenCalledWith('1');
    expect(fixture.componentInstance.playlist()).toEqual(mockPlaylist);
    expect(fixture.componentInstance.songs()).toEqual(mockSongs);
  });

  /* it('should show apiUrl', () => {
    const fixture = TestBed.createComponent(PlaylistDetailComponent);
    expect(fixture.componentInstance.apiUrl).toBe('http://localhost:8080');
  }); */
});
