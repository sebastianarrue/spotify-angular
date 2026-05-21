import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LucideLogOut, LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [LucideUser, LucideLogOut],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  authService = inject(AuthService);
}
