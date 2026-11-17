
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Categoria,
  CategoriaRequest,
  CategoriaService
} from '../../services/categoria';

import { CategoriaFormulario } from '../../components/categoria-formulario/categoria-formulario';

@Component({
  selector: 'app-categoria-lista',
  standalone: true,
  imports: [CommonModule, CategoriaFormulario],
  templateUrl: './categoria-lista.html',
  styleUrl: './categoria-lista.scss'
})
export class CategoriaLista implements OnInit {

  private readonly categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  categoriaSeleccionada: Categoria | null = null;

  cargando = false;
  guardando = false;
  mostrarFormulario = false;

  errorMessage = '';
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al listar categorías:', error);
        this.errorMessage = 'No se pudieron cargar las categorías.';
        this.cargando = false;
      }
    });
  }

  nuevaCategoria(): void {
    this.categoriaSeleccionada = null;
    this.mensajeExito = '';
    this.errorMessage = '';
    this.mostrarFormulario = true;
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaSeleccionada = categoria;
    this.mensajeExito = '';
    this.errorMessage = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    if (this.guardando) return;

    this.mostrarFormulario = false;
    this.categoriaSeleccionada = null;
  }

  guardarCategoria(datos: CategoriaRequest): void {
    if (this.guardando) return;

    this.guardando = true;
    this.errorMessage = '';
    this.mensajeExito = '';

    const esEdicion = this.categoriaSeleccionada !== null;

    const peticion = esEdicion
      ? this.categoriaService.actualizar(
          this.categoriaSeleccionada!.id,
          datos
        )
      : this.categoriaService.registrar(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.categoriaSeleccionada = null;

        this.mensajeExito = esEdicion
          ? 'Categoría actualizada correctamente.'
          : 'Categoría registrada correctamente.';

        this.cargarCategorias();
      },
      error: (error) => {
        console.error('Error al guardar categoría:', error);

        this.errorMessage =
          'No se pudo guardar la categoría. Verifique los datos ingresados.';

        this.guardando = false;
      }
    });
  }
}
