import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  cargando = false;
  error = '';

  ingresar(): void {
    this.error = '';

    if (!this.username.trim() || !this.password) {
      this.error = 'Ingresa tu usuario y contraseña.';
      return;
    }

    this.cargando = true;

    this.auth.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/usuarios']);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando = false;
        this.error = e.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : e.status === 403
            ? 'Acceso denegado. Verifica las credenciales y los permisos.'
            : 'No se pudo iniciar sesión. Verifica que el backend esté activo.';
      }
    });
  }
}