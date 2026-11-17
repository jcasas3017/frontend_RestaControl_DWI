
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaFormulario } from '../../components/mesa-formulario/mesa-formulario';
import {
  Mesa,
  MesaService
} from '../../services/mesa';

@Component({
  selector: 'app-mesa-lista',
  standalone: true,
  imports: [CommonModule, MesaFormulario],
  templateUrl: './mesa-lista.html',
  styleUrl: './mesa-lista.scss'
})
export class MesaLista implements OnInit {

  private readonly mesaService = inject(MesaService);

  mesas: Mesa[] = [];

  cargando = false;
  procesandoId: string | null = null;

  error = '';
  mensaje = '';

  // Control del formulario
  mostrarFormulario = false;
  mesaSeleccionada: Mesa | null = null;

  ngOnInit(): void {
    this.cargarMesas();
  }

  // Listar mesas desde PostgreSQL
  cargarMesas(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.mesaService.listar().subscribe({
      next: (response) => {
        this.mesas = [...response].sort(
          (a, b) => a.codigo.localeCompare(
            b.codigo,
            undefined,
            { numeric: true }
          )
        );

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar mesas:', err);

        this.error = 'No se pudieron cargar las mesas.';
        this.cargando = false;
      }
    });
  }

  // Preparar registro de nueva mesa
  nuevaMesa(): void {
    this.mesaSeleccionada = null;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  // Preparar edición de mesa
  editarMesa(mesa: Mesa): void {
    this.mesaSeleccionada = mesa;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  // Cerrar formulario
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.mesaSeleccionada = null;
  }

  // Actualizar listado después de guardar
  mesaGuardada(): void {
    this.cerrarFormulario();
    this.cargarMesas();
  }

  // Activar o inactivar mesa
  cambiarEstado(mesa: Mesa): void {

    const accion = mesa.activa
      ? 'inactivar'
      : 'activar';

    const confirmado = confirm(
      `¿Estás seguro de ${accion} la mesa ${mesa.codigo}?`
    );

    if (!confirmado) {
      return;
    }

    this.procesandoId = mesa.id;
    this.error = '';
    this.mensaje = '';

    this.mesaService.cambiarEstado(mesa.id).subscribe({
      next: (actualizada) => {

        this.mesas = this.mesas.map(item =>
          item.id === actualizada.id
            ? actualizada
            : item
        );

        this.mensaje = `La mesa ${actualizada.codigo} fue ${
          actualizada.activa ? 'activada' : 'inactivada'
        } correctamente.`;

        this.procesandoId = null;
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);

        this.error =
          'No se pudo cambiar el estado de la mesa.';

        this.procesandoId = null;
      }
    });
  }

  // Resumen
  get totalMesas(): number {
    return this.mesas.length;
  }

  get mesasActivas(): number {
    return this.mesas.filter(mesa => mesa.activa).length;
  }

  get mesasInactivas(): number {
    return this.mesas.filter(mesa => !mesa.activa).length;
  }
}
