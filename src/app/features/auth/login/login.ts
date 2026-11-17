
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  iniciarSesion(): void {

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Ingrese su usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/inicio');
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo iniciar sesión. Verifique sus credenciales o la conexión con el servidor.';
      }
    });
  }
}

