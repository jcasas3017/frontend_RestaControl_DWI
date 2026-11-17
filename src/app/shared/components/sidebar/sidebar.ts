
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
