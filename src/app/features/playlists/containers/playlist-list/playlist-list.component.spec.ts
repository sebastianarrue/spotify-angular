import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PlaylistListComponent } from './playlist-list.component';
import { PlaylistFacadeService } from '../../../../core/services/playlist.facade.service';
import { LucideTrash2, LucideMusic } from '@lucide/angular';
import { RouterLink } from '@angular/router';

describe('PlaylistListComponent', () => {
  let mockPlaylistFacade: any;

  beforeEach(async () => {
    mockPlaylistFacade = {
      playlists: vi.fn().mockReturnValue([]),
      getPlaylists: vi.fn().mockReturnValue(of({})),
      createPlaylist: vi.fn().mockReturnValue(of(undefined)),
      deletePlaylist: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LucideTrash2, LucideMusic, RouterLink, PlaylistListComponent],
      providers: [
        { provide: PlaylistFacadeService, useValue: mockPlaylistFacade },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call getPlaylists on init', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    fixture.detectChanges();
    expect(mockPlaylistFacade.getPlaylists).toHaveBeenCalledTimes(1);
  });

  it('should start with showCreateForm false', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    expect(fixture.componentInstance.showCreateForm()).toBe(false);
  });

  it('should have invalid form when empty', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    expect(fixture.componentInstance.playlistForm.valid).toBe(false);
  });

  it('should require name', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    const form = fixture.componentInstance.playlistForm;
    form.controls.name.setValue('');
    expect(form.controls.name.valid).toBe(false);
    form.controls.name.setValue('My P');
    expect(form.controls.name.valid).toBe(true);
  });

  it('should not call createPlaylist when form invalid', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    fixture.componentInstance.onSubmit();
    expect(mockPlaylistFacade.createPlaylist).not.toHaveBeenCalled();
  });

  it('should call createPlaylist and reset on success', () => {
    const fixture = TestBed.createComponent(PlaylistListComponent);
    const comp = fixture.componentInstance;
    comp.playlistForm.controls.name.setValue('New');
    comp.playlistForm.controls.description.setValue('Desc');
    comp.onSubmit();
    expect(mockPlaylistFacade.createPlaylist).toHaveBeenCalledWith('New', 'Desc');
    expect(comp.showCreateForm()).toBe(false);
    expect(comp.playlistForm.value).toEqual({ name: null, description: null });
  });
});
