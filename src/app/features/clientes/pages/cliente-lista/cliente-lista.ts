
import { Component, OnInit, inject } from '@angular/core';

import {
  Cliente,
  ClienteRequest,
  ClienteService
} from '../../services/cliente';

import { ClienteFormulario } from '../../components/cliente-formulario/cliente-formulario';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [ClienteFormulario],
  templateUrl: './cliente-lista.html',
  styleUrl: './cliente-lista.scss'
})
export class ClienteLista implements OnInit {

  private readonly clienteService = inject(ClienteService);

  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;

  cargando = false;
  guardando = false;
  mostrarFormulario = false;

  errorMessage = '';
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.errorMessage = 'No se pudieron cargar los clientes.';
        this.cargando = false;
      }
    });
  }

  nuevoCliente(): void {
    this.clienteSeleccionado = null;
    this.errorMessage = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  editarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.errorMessage = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    if (this.guardando) return;

    this.mostrarFormulario = false;
    this.clienteSeleccionado = null;
    this.errorMessage = '';
  }

  guardarCliente(datos: ClienteRequest): void {
    if (this.guardando) return;

    this.guardando = true;
    this.errorMessage = '';
    this.mensajeExito = '';

    const esEdicion = this.clienteSeleccionado !== null;

    const peticion = esEdicion
      ? this.clienteService.actualizar(
          this.clienteSeleccionado!.id,
          datos
        )
      : this.clienteService.registrar(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.clienteSeleccionado = null;

        this.mensajeExito = esEdicion
          ? 'Cliente actualizado correctamente.'
          : 'Cliente registrado correctamente.';

        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al guardar cliente:', error);

        this.errorMessage = error.status === 403
          ? 'No tienes permisos para realizar esta operación.'
          : 'No se pudo guardar el cliente. Verifica los datos ingresados.';

        this.guardando = false;
      }
    });
  }


  cambiarEstadoCliente(cliente: Cliente): void {
    if (this.guardando) return;

    const accion = cliente.activo ? 'inactivar' : 'activar';

    const confirmado = window.confirm(
      `¿Está seguro de ${accion} al cliente "${cliente.nombres} ${cliente.apellidos}"?`
    );

    if (!confirmado) return;

    this.guardando = true;
    this.errorMessage = '';
    this.mensajeExito = '';

    this.clienteService.cambiarEstado(cliente.id).subscribe({
      next: () => {
        this.guardando = false;

        this.mensajeExito = cliente.activo
          ? 'Cliente inactivado correctamente.'
          : 'Cliente activado correctamente.';

        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al cambiar estado del cliente:', error);

        this.errorMessage = error.status === 403
          ? 'No tienes permisos para cambiar el estado del cliente.'
          : 'No se pudo cambiar el estado del cliente.';

        this.guardando = false;
      }
    });
  }

}
