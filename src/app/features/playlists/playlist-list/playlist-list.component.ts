import { Component, inject, signal } from '@angular/core';
import { PlaylistService } from '../../../core/services/playlist.service';
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
  playlistService = inject(PlaylistService);
  private fb = inject(FormBuilder);
  
  showCreateForm = signal(false);

  playlistForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  ngOnInit() {
    this.playlistService.getPlaylists().subscribe();
  }

  onSubmit() {
    if (this.playlistForm.valid) {
      const { name, description } = this.playlistForm.value;
      this.playlistService.createPlaylist(name!, description || '').subscribe(() => {
        this.showCreateForm.set(false);
        this.playlistForm.reset();
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Delete this playlist?')) {
      this.playlistService.deletePlaylist(id).subscribe();
    }
  }
}
