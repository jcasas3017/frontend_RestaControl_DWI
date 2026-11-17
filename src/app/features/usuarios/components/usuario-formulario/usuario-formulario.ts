
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Usuario,
  UsuarioRequest,
  UsuarioService
} from '../../services/usuario';

@Component({
  selector: 'app-usuario-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-formulario.html',
  styleUrl: './usuario-formulario.scss'
})
export class UsuarioFormulario implements OnChanges {

  private readonly usuarioService = inject(UsuarioService);

  @Input() usuario: Usuario | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  guardando = false;
  error = '';

  readonly roles = [
    { valor: 'ROLE_ADMIN', nombre: 'Administrador' },
    { valor: 'ROLE_CAJERO', nombre: 'Cajero' },
    { valor: 'ROLE_COCINERO', nombre: 'Cocinero' },
    { valor: 'ROLE_MOZO', nombre: 'Mozo' },
    { valor: 'ROLE_USER', nombre: 'Usuario' }
  ];

  formulario: UsuarioRequest = this.crearFormularioVacio();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario']) {
      this.formulario = this.usuario
        ? {
            codigo: this.usuario.codigo,
            nombres: this.usuario.nombres,
            apellidos: this.usuario.apellidos,
            username: this.usuario.username,
            password: '',
            rol: this.obtenerRolSeguridad(this.usuario.rol),
            activo: this.usuario.activo
          }
        : this.crearFormularioVacio();

      this.error = '';
    }
  }

  private crearFormularioVacio(): UsuarioRequest {
    return {
      codigo: '',
      nombres: '',
      apellidos: '',
      username: '',
      password: '',
      rol: 'ROLE_USER',
      activo: true
    };
  }

  private obtenerRolSeguridad(rol: string): string {
    const equivalencias: Record<string, string> = {
      'Administrador': 'ROLE_ADMIN',
      'ADMIN': 'ROLE_ADMIN',
      'Cajero': 'ROLE_CAJERO',
      'Cocinero': 'ROLE_COCINERO',
      'Mozo': 'ROLE_MOZO',
      'Recepcion': 'ROLE_USER',
      'Usuario': 'ROLE_USER'
    };

    return equivalencias[rol] ?? rol;
  }

  rolesValidosIncluyen(rol: string): boolean {
    return this.roles.some(item => item.valor === rol);
  }

  guardar(): void {
    if (this.guardando) {
      return;
    }

    this.error = '';

    const request: UsuarioRequest = {
      ...this.formulario,
      codigo: this.formulario.codigo.trim(),
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      username: this.formulario.username.trim()
    };

    if (!request.codigo || !request.nombres ||
        !request.apellidos || !request.username) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    if (!this.usuario && !request.password.trim()) {
      this.error = 'La contraseña es obligatoria para nuevos usuarios.';
      return;
    }

    if (!this.roles.some(rol => rol.valor === request.rol)) {
      this.error = 'Selecciona un rol válido.';
      return;
    }

    this.guardando = true;

    const operacion = this.usuario
      ? this.usuarioService.actualizar(this.usuario.id, request)
      : this.usuarioService.registrar(request);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.guardado.emit();
      },
      error: (err) => {
        console.error('Error al guardar usuario:', err);

        this.error = err.error?.mensaje ||
          'No se pudo guardar el usuario. Verifica los datos.';

        this.guardando = false;
      }
    });
  }

  cancelar(): void {
    if (!this.guardando) {
      this.cerrar.emit();
    }
  }
}
