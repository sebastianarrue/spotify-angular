import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHome, LucideLibrary, LucidePlus } from '@lucide/angular';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideHome, LucideLibrary, LucidePlus],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  playlistService = inject(PlaylistService);
  
  ngOnInit() {
    this.playlistService.getPlaylists().subscribe();
  }
}
