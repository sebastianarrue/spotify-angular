import { Component, inject } from '@angular/core';
import { AuthFacadeService } from '../../../core/services/auth-facade.service';
import { LucideLogOut, LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [LucideUser, LucideLogOut],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  authFacade = inject(AuthFacadeService);
}
