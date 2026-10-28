
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Usuario,
  UsuarioRequest
} from '../../shared/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  busqueda = '';
  filtroEstado = 'todos';

  cargando = false;
  guardando = false;
  mostrarFormulario = false;

  usuarioEditando: string | null = null;

  error = '';
  mensaje = '';

  readonly roles = [
    { valor: 'ROLE_ADMIN', etiqueta: 'Administrador' },
    { valor: 'ROLE_MOZO', etiqueta: 'Mozo' },
    { valor: 'ROLE_COCINERO', etiqueta: 'Cocinero' },
    { valor: 'ROLE_CAJERO', etiqueta: 'Cajero' },
    { valor: 'ROLE_USER', etiqueta: 'Usuario' }
  ];

  formulario: UsuarioRequest = this.formularioVacio();

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get usuariosFiltrados(): Usuario[] {
    const termino = this.busqueda.trim().toLowerCase();

    return this.usuarios.filter(usuario => {
      const valores = [
        usuario.codigo,
        usuario.nombres,
        usuario.apellidos,
        usuario.username,
        usuario.rol
      ];

      const coincideBusqueda = valores.some(valor =>
        (valor ?? '').toLowerCase().includes(termino)
      );

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && usuario.activo) ||
        (this.filtroEstado === 'inactivos' && !usuario.activo);

      return coincideBusqueda && coincideEstado;
    });
  }

  get totalActivos(): number {
    return this.usuarios.filter(usuario => usuario.activo).length;
  }

  get totalInactivos(): number {
    return this.usuarios.filter(usuario => !usuario.activo).length;
  }

  estaActivo(usuario: Usuario): boolean {
    return usuario.activo;
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.usuarioService.listar().subscribe({
      next: usuarios => {
        this.usuarios = Array.isArray(usuarios) ? usuarios : [];
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
        this.cargando = false;
      }
    });
  }

  nuevoUsuario(): void {
    this.limpiarMensajes();
    this.usuarioEditando = null;
    this.formulario = this.formularioVacio();
    this.mostrarFormulario = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.limpiarMensajes();

    this.usuarioEditando = usuario.id;

    this.formulario = {
      codigo: usuario.codigo,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      username: usuario.username,
      password: '',
      rol: usuario.rol,
      activo: usuario.activo
    };

    this.mostrarFormulario = true;
  }

  guardarUsuario(): void {
    this.limpiarMensajes();

    const codigo = this.formulario.codigo.trim();
    const nombres = this.formulario.nombres.trim();
    const apellidos = this.formulario.apellidos.trim();
    const username = this.formulario.username.trim();
    const password = this.formulario.password?.trim() ?? '';
    const rol = this.formulario.rol.trim();

    if (!codigo || !nombres || !apellidos || !username || !rol) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    if (!this.usuarioEditando && !password) {
      this.error = 'La contraseña es obligatoria al registrar un usuario.';
      return;
    }

    const esEdicion = this.usuarioEditando !== null;
    const idEdicion = this.usuarioEditando;

    const solicitud: UsuarioRequest = {
      codigo,
      nombres,
      apellidos,
      username,
      password: password || undefined,
      rol,
      activo: this.formulario.activo
    };

    this.guardando = true;

    const operacion = esEdicion && idEdicion
      ? this.usuarioService.actualizar(idEdicion, solicitud)
      : this.usuarioService.registrar(solicitud);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.usuarioEditando = null;

        this.mensaje = esEdicion
          ? 'Usuario actualizado correctamente.'
          : 'Usuario registrado correctamente.';

        this.cargarUsuarios();
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        this.error = this.mensajeError(error);
      }
    });
  }

  cambiarEstado(usuario: Usuario): void {
    this.limpiarMensajes();

    const accion = usuario.activo ? 'desactivar' : 'activar';
    const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`;

    if (!window.confirm(`¿Deseas ${accion} a ${nombreCompleto}?`)) {
      return;
    }

    this.usuarioService
      .cambiarEstado(usuario.id, !usuario.activo)
      .subscribe({
        next: () => {
          this.mensaje = usuario.activo
            ? 'Usuario desactivado correctamente.'
            : 'Usuario activado correctamente.';

          this.cargarUsuarios();
        },
        error: (error: HttpErrorResponse) => {
          this.error = this.mensajeError(error);
        }
      });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.usuarioEditando = null;
    this.formulario = this.formularioVacio();
    this.limpiarMensajes();
  }

  etiquetaRol(rol: string): string {
    return this.roles.find(item => item.valor === rol)?.etiqueta ?? rol;
  }

  private formularioVacio(): UsuarioRequest {
    return {
      codigo: '',
      nombres: '',
      apellidos: '',
      username: '',
      password: '',
      rol: 'ROLE_MOZO',
      activo: true
    };
  }

  private limpiarMensajes(): void {
    this.error = '';
    this.mensaje = '';
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Comprueba que esté ejecutándose en el puerto 5051 y que el proxy de Angular esté configurado.';
    }

    if (error.status === 401) {
      return 'Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.';
    }

    if (error.status === 403) {
      return 'No tienes permisos para realizar esta operación.';
    }

    if (error.status === 404) {
      return 'No se encontró el usuario o el endpoint solicitado.';
    }

    if (error.status === 409) {
      return 'Ya existe un usuario con ese código o nombre de usuario.';
    }

    if (error.status >= 500) {
      return 'El backend encontró un error interno. Revisa los registros del servidor.';
    }

    return error.error?.message
      ?? `Error del servidor (${error.status}). Revisa la respuesta del backend.`;
  }
}
