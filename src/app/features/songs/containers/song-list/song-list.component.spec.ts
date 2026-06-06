import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SongListComponent } from './song-list.component';
import { SongFacadeService } from '../../services/song.facade.service';
import { PlaylistFacadeService } from '../../../../core/services/playlist.facade.service';
import { SongCardComponent } from '../../components/song-card/song-card.component';
import { LucideMusic } from '@lucide/angular';

describe('SongListComponent', () => {
  let mockSongFacade: any;
  let mockPlaylistFacade: any;

  beforeEach(async () => {
    mockSongFacade = {
      songs: vi.fn().mockReturnValue([]),
      getSongs: vi.fn().mockReturnValue(of({})),
      createSong: vi.fn().mockReturnValue(of({})),
      deleteSong: vi.fn().mockReturnValue(of({})),
    };
    mockPlaylistFacade = {
      playlists: vi.fn().mockReturnValue([]),
      getPlaylists: vi.fn().mockReturnValue(of({})),
      addSongToPlaylist: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LucideMusic, SongCardComponent, SongListComponent],
      providers: [
        { provide: SongFacadeService, useValue: mockSongFacade },
        { provide: PlaylistFacadeService, useValue: mockPlaylistFacade },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load songs and playlists on init', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    fixture.detectChanges();
    expect(mockSongFacade.getSongs).toHaveBeenCalledTimes(1);
    expect(mockPlaylistFacade.getPlaylists).toHaveBeenCalledTimes(1);
  });

  it('should start with showCreateForm false', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    expect(fixture.componentInstance.showCreateForm()).toBe(false);
  });

  it('should start with selectedSong null', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    expect(fixture.componentInstance.selectedSong()).toBeNull();
  });

  it('should have invalid form when empty', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    expect(fixture.componentInstance.songForm.valid).toBe(false);
  });

  it('should have valid form when all fields are filled', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    const form = fixture.componentInstance.songForm;
    form.controls.title.setValue('Song');
    form.controls.author.setValue('Artist');
    form.controls.album.setValue('Album');
    expect(form.valid).toBe(true);
  });

  it('should not call createSong when form is invalid', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    fixture.componentInstance.onSubmit();
    expect(mockSongFacade.createSong).not.toHaveBeenCalled();
  });

  it('should not call createSong when no file selected', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    const comp = fixture.componentInstance;
    comp.songForm.controls.title.setValue('Song');
    comp.songForm.controls.author.setValue('Artist');
    comp.songForm.controls.album.setValue('Album');
    comp.selectedFile = null;
    comp.onSubmit();
    expect(mockSongFacade.createSong).not.toHaveBeenCalled();
  });

  it('should call createSong and reset form on success', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    const comp = fixture.componentInstance;
    comp.songForm.controls.title.setValue('Song');
    comp.songForm.controls.author.setValue('Artist');
    comp.songForm.controls.album.setValue('Album');
    comp.selectedFile = new File([''], 'test.png');
    comp.onSubmit();
    expect(mockSongFacade.createSong).toHaveBeenCalled();
    expect(comp.showCreateForm()).toBe(false);
    expect(comp.selectedFile).toBeNull();
  });

  it('should open modal on openAddToPlaylistModal', () => {
    const fixture = TestBed.createComponent(SongListComponent);
    const song = { _id: '1', title: 'S', album: 'A', author: 'Ar', imageUrl: 'i.jpg' };
    fixture.componentInstance.openAddToPlaylistModal(song);
    expect(fixture.componentInstance.selectedSong()).toEqual(song);
  });

  it('should add song to playlist and alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fixture = TestBed.createComponent(SongListComponent);
    const comp = fixture.componentInstance;
    comp.selectedSong.set({ _id: '1', title: 'S', album: 'A', author: 'Ar', imageUrl: 'i.jpg' });
    comp.addSongToPlaylist(5);
    expect(mockPlaylistFacade.addSongToPlaylist).toHaveBeenCalledWith(5, '1');
    expect(comp.selectedSong()).toBeNull();
    expect(alertSpy).toHaveBeenCalledWith('Song added!');
    alertSpy.mockRestore();
  });
});
