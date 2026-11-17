
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Plato,
  PlatoRequest
} from '../../services/plato';

import { Categoria } from '../../../categorias/services/categoria';

@Component({
  selector: 'app-plato-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './plato-formulario.html',
  styleUrl: './plato-formulario.scss'
})
export class PlatoFormulario implements OnChanges {

  @Input() plato: Plato | null = null;
  @Input() categorias: Categoria[] = [];
  @Input() guardando = false;

  @Output() guardar = new EventEmitter<PlatoRequest>();
  @Output() cancelar = new EventEmitter<void>();

  formulario: PlatoRequest = this.crearFormularioVacio();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plato']) {
      this.formulario = this.plato
        ? {
            codigo: this.plato.codigo,
            idCategoria: this.plato.idCategoria,
            nombre: this.plato.nombre,
            descripcion: this.plato.descripcion,
            precio: this.plato.precio,
            disponible: this.plato.disponible,
            activo: this.plato.activo
          }
        : this.crearFormularioVacio();
    }
  }

  private crearFormularioVacio(): PlatoRequest {
    return {
      codigo: '',
      idCategoria: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      disponible: true,
      activo: true
    };
  }

  enviarFormulario(): void {
    if (
      !this.formulario.codigo.trim() ||
      !this.formulario.nombre.trim() ||
      !this.formulario.idCategoria ||
      !Number.isFinite(this.formulario.precio) ||
      this.formulario.precio <= 0
    ) {
      return;
    }

    this.guardar.emit({
      ...this.formulario,
      codigo: this.formulario.codigo.trim(),
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion?.trim() || null
    });
  }

  cancelarFormulario(): void {
    this.cancelar.emit();
  }
}
