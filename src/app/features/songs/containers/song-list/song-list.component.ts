import { Component, inject, signal } from '@angular/core';
import { SongFacadeService } from '../../services/song.facade.service';
import { PlaylistFacadeService } from '../../../../core/services/playlist.facade.service';
import { SongCardComponent } from '../../components/song-card/song-card.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Song } from '../../../../core/models/song.model';
import { LucideMusic } from '@lucide/angular';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [SongCardComponent, ReactiveFormsModule, LucideMusic],
  templateUrl: './song-list.component.html',
})
export class SongListComponent {
  songFacade = inject(SongFacadeService);
  playlistFacade = inject(PlaylistFacadeService);
  private fb = inject(FormBuilder);
  
  showCreateForm = signal(false);
  selectedSong = signal<Song | null>(null);
  selectedFile: File | null = null;

  songForm = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    album: ['', [Validators.required]]
  });

  ngOnInit() {
    this.songFacade.getSongs().subscribe();
    this.playlistFacade.getPlaylists().subscribe();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.songForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.songForm.value.title!);
      formData.append('author', this.songForm.value.author!);
      formData.append('album', this.songForm.value.album!);
      formData.append('image', this.selectedFile);

      this.songFacade.createSong(formData).subscribe(() => {
        this.showCreateForm.set(false);
        this.songForm.reset();
        this.selectedFile = null;
      });
    }
  }

  onDelete(id: string) {
    if (confirm('Are you sure?')) {
      this.songFacade.deleteSong(id).subscribe();
    }
  }

  openAddToPlaylistModal(song: Song) {
    this.selectedSong.set(song);
  }

  addSongToPlaylist(playlistId: number) {
    const song = this.selectedSong();
    if (song) {
      this.playlistFacade.addSongToPlaylist(playlistId, song._id).subscribe(() => {
        this.selectedSong.set(null);
        alert('Song added!');
      });
    }
  }
}
