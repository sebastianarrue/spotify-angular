import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
<div class="h-screen flex overflow-hidden">
  <app-sidebar></app-sidebar>
  <div class="flex-1 flex flex-col">
    <app-topbar></app-topbar>
    <main class="flex-1 overflow-y-auto pt-24">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>`
})
export class LayoutComponent {}
