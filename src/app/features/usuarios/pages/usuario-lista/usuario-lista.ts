
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Usuario,
  UsuarioService
} from '../../services/usuario';
import { UsuarioFormulario } from '../../components/usuario-formulario/usuario-formulario';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, UsuarioFormulario],
  templateUrl: './usuario-lista.html',
  styleUrl: './usuario-lista.scss'
})
export class UsuarioLista implements OnInit {

  private readonly usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];

  cargando = false;
  procesandoId: string | null = null;

  error = '';
  mensaje = '';
  busqueda = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.usuarios = [...response].sort(
          (a, b) => a.codigo.localeCompare(
            b.codigo,
            undefined,
            { numeric: true }
          )
        );

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = err.error?.mensaje ||
          'No se pudieron cargar los usuarios.';
        this.cargando = false;
      }
    });
  }

  cambiarEstado(usuario: Usuario): void {
    const accion = usuario.activo ? 'inactivar' : 'activar';

    const confirmado = confirm(
      `¿Estás seguro de ${accion} al usuario ${usuario.username}?`
    );

    if (!confirmado) {
      return;
    }

    this.procesandoId = usuario.id;
    this.error = '';
    this.mensaje = '';

    this.usuarioService.cambiarEstado(usuario.id).subscribe({
      next: (actualizado) => {
        this.usuarios = this.usuarios.map(item =>
          item.id === actualizado.id ? actualizado : item
        );

        this.mensaje = `El usuario ${actualizado.username} fue ${
          actualizado.activo ? 'activado' : 'inactivado'
        } correctamente.`;

        this.procesandoId = null;
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        this.error = err.error?.mensaje ||
          'No se pudo cambiar el estado del usuario.';
        this.procesandoId = null;
      }
    });
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor;
  }

  get usuariosFiltrados(): Usuario[] {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      return this.usuarios;
    }

    return this.usuarios.filter(usuario =>
      [
        usuario.codigo,
        usuario.nombres,
        usuario.apellidos,
        usuario.username,
        usuario.rol
      ].some(valor => valor.toLowerCase().includes(texto))
    );
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get usuariosActivos(): number {
    return this.usuarios.filter(usuario => usuario.activo).length;
  }

  get usuariosInactivos(): number {
    return this.usuarios.filter(usuario => !usuario.activo).length;
  }

  // Control del formulario
  mostrarFormulario = false;
  usuarioSeleccionado: Usuario | null = null;

  // Abrir formulario de registro
  nuevoUsuario(): void {
    this.usuarioSeleccionado = null;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  // Abrir formulario de edición
  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  // Cerrar formulario
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.usuarioSeleccionado = null;
  }

  // Actualizar listado después de guardar
  usuarioGuardado(): void {
    this.cerrarFormulario();
    this.cargarUsuarios();
  }
}
