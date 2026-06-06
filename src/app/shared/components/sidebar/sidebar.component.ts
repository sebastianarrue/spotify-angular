import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideHome, LucideLibrary, LucidePlus, LucideX } from '@lucide/angular';
import { PlaylistFacadeService } from '../../../core/services/playlist.facade.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, LucideHome, LucideLibrary, LucidePlus, LucideX],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
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

  onCreate() {
    if (this.playlistForm.valid) {
      const { name, description } = this.playlistForm.value;
      this.playlistFacade.createPlaylist(name!, description || '').subscribe(() => {
        this.showCreateForm.set(false);
        this.playlistForm.reset();
      });
    }
  }
}
