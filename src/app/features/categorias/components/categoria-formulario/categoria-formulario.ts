
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
  Categoria,
  CategoriaRequest
} from '../../services/categoria';

@Component({
  selector: 'app-categoria-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categoria-formulario.html',
  styleUrl: './categoria-formulario.scss'
})
export class CategoriaFormulario implements OnChanges {

  @Input() categoria: Categoria | null = null;
  @Input() guardando = false;

  @Output() guardar = new EventEmitter<CategoriaRequest>();
  @Output() cancelar = new EventEmitter<void>();

  formulario: CategoriaRequest = this.crearFormularioVacio();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoria']) {
      this.formulario = this.categoria
        ? {
            codigo: this.categoria.codigo,
            nombre: this.categoria.nombre,
            orden: this.categoria.orden,
            activo: this.categoria.activo
          }
        : this.crearFormularioVacio();
    }
  }

  private crearFormularioVacio(): CategoriaRequest {
    return {
      codigo: '',
      nombre: '',
      orden: 1,
      activo: true
    };
  }

  enviarFormulario(): void {
    if (
      !this.formulario.codigo.trim() ||
      !this.formulario.nombre.trim() ||
      this.formulario.orden < 1
    ) {
      return;
    }

    this.guardar.emit({
      codigo: this.formulario.codigo.trim(),
      nombre: this.formulario.nombre.trim(),
      orden: this.formulario.orden,
      activo: this.formulario.activo
    });
  }

  cancelarFormulario(): void {
    this.cancelar.emit();
  }
}

