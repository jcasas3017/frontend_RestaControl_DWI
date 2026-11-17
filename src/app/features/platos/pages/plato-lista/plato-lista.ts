
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  Plato,
  PlatoRequest,
  PlatoService
} from '../../services/plato';

import {
  Categoria,
  CategoriaService
} from '../../../categorias/services/categoria';

import { PlatoFormulario } from '../../components/plato-formulario/plato-formulario';

@Component({
  selector: 'app-plato-lista',
  standalone: true,
  imports: [PlatoFormulario],
  templateUrl: './plato-lista.html',
  styleUrl: './plato-lista.scss'
})
export class PlatoLista implements OnInit {

  private readonly platoService = inject(PlatoService);
  private readonly categoriaService = inject(CategoriaService);

  platos: Plato[] = [];
  categorias: Categoria[] = [];

  platoSeleccionado: Plato | null = null;

  cargando = false;
  guardando = false;
  mostrarFormulario = false;

  errorMessage = '';
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMessage = '';

    forkJoin({
      platos: this.platoService.listar(),
      categorias: this.categoriaService.listar()
    }).subscribe({
      next: ({ platos, categorias }) => {
        this.platos = platos;
        this.categorias = categorias;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.errorMessage = 'No se pudieron cargar los platos.';
        this.cargando = false;
      }
    });
  }

  obtenerNombreCategoria(idCategoria: string): string {
    return this.categorias.find(
      categoria => categoria.id === idCategoria
    )?.nombre ?? 'Sin categoría';
  }

  nuevoPlato(): void {
    this.platoSeleccionado = null;
    this.errorMessage = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  editarPlato(plato: Plato): void {
    this.platoSeleccionado = plato;
    this.errorMessage = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    if (this.guardando) return;

    this.mostrarFormulario = false;
    this.platoSeleccionado = null;
  }

  guardarPlato(datos: PlatoRequest): void {
    if (this.guardando) return;

    this.guardando = true;
    this.errorMessage = '';
    this.mensajeExito = '';

    const esEdicion = this.platoSeleccionado !== null;

    const peticion = esEdicion
      ? this.platoService.actualizar(this.platoSeleccionado!.id, datos)
      : this.platoService.registrar(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.platoSeleccionado = null;

        this.mensajeExito = esEdicion
          ? 'Plato actualizado correctamente.'
          : 'Plato registrado correctamente.';

        this.cargarDatos();
      },
      error: (error) => {
        console.error('Error al guardar plato:', error);

        this.errorMessage = error.status === 403
          ? 'No tienes permisos para realizar esta operación.'
          : 'No se pudo guardar el plato. Verifique los datos ingresados.';

        this.guardando = false;
      }
    });
  }


  cambiarEstadoPlato(plato: Plato): void {
    if (this.guardando) return;

    const accion = plato.activo ? 'inactivar' : 'activar';

    const confirmado = window.confirm(
      `¿Está seguro de ${accion} el plato "${plato.nombre}"?`
    );

    if (!confirmado) return;

    this.guardando = true;
    this.errorMessage = '';
    this.mensajeExito = '';

    this.platoService.cambiarEstado(plato.id).subscribe({
      next: () => {
        this.guardando = false;

        this.mensajeExito = plato.activo
          ? 'Plato inactivado correctamente.'
          : 'Plato activado correctamente.';

        this.cargarDatos();
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);

        this.errorMessage = error.status === 403
          ? 'No tienes permisos para cambiar el estado del plato.'
          : 'No se pudo cambiar el estado del plato.';

        this.guardando = false;
      }
    });
  }

}
