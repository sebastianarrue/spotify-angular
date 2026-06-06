import { Component, inject, signal } from '@angular/core';
import { PlaylistFacadeService } from '../../../../core/services/playlist.facade.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideTrash2, LucideMusic } from '@lucide/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [ReactiveFormsModule, LucideTrash2, LucideMusic, RouterLink],
  templateUrl: './playlist-list.component.html',
})
export class PlaylistListComponent {
  playlistFacade = inject(PlaylistFacadeService);
  private fb = inject(FormBuilder);
  
  showCreateForm = signal(false);

  playlistForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  ngOnInit() {
    this.playlistFacade.getPlaylists().subscribe();
  }

  onSubmit() {
    if (this.playlistForm.valid) {
      const { name, description } = this.playlistForm.value;
      this.playlistFacade.createPlaylist(name!, description || '').subscribe(() => {
        this.showCreateForm.set(false);
        this.playlistForm.reset();
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Delete this playlist?')) {
      this.playlistFacade.deletePlaylist(id).subscribe();
    }
  }
}
