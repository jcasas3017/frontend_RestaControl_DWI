
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
