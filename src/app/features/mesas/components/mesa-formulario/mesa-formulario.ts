
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
  Mesa,
  MesaRequest,
  MesaService
} from '../../services/mesa';

@Component({
  selector: 'app-mesa-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesa-formulario.html',
  styleUrl: './mesa-formulario.scss'
})
export class MesaFormulario implements OnChanges {

  private readonly mesaService = inject(MesaService);

  @Input() mesa: Mesa | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  guardando = false;
  error = '';

  formulario: MesaRequest = this.crearFormularioVacio();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mesa']) {
      this.formulario = this.mesa
        ? {
            codigo: this.mesa.codigo,
            capacidad: this.mesa.capacidad,
            ubicacion: this.mesa.ubicacion ?? '',
            activa: this.mesa.activa,
            estado: this.mesa.estado
          }
        : this.crearFormularioVacio();

      this.error = '';
    }
  }

  private crearFormularioVacio(): MesaRequest {
    return {
      codigo: '',
      capacidad: 4,
      ubicacion: '',
      activa: true,
      estado: 'Disponible'
    };
  }

  guardar(): void {
    if (this.guardando) {
      return;
    }

    this.error = '';

    const codigo = this.formulario.codigo.trim();

    if (!codigo) {
      this.error = 'El código es obligatorio.';
      return;
    }

    if (codigo.length > 20) {
      this.error = 'El código no puede superar 20 caracteres.';
      return;
    }

    if (!Number.isInteger(this.formulario.capacidad)
        || this.formulario.capacidad <= 0) {
      this.error = 'La capacidad debe ser un número entero mayor que cero.';
      return;
    }

    if (this.formulario.ubicacion.length > 100) {
      this.error = 'La ubicación no puede superar 100 caracteres.';
      return;
    }

    const request: MesaRequest = {
      ...this.formulario,
      codigo,
      ubicacion: this.formulario.ubicacion.trim()
    };

    this.guardando = true;

    const operacion = this.mesa
      ? this.mesaService.actualizar(this.mesa.id, request)
      : this.mesaService.registrar(request);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.guardado.emit();
      },
      error: (err) => {
        console.error('Error al guardar mesa:', err);

        this.error = err.status === 409
          ? 'Ya existe una mesa con ese código.'
          : 'No se pudo guardar la mesa. Verifica los datos.';

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
