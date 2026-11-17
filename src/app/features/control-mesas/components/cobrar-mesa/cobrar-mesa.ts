import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AtencionDetalle,
} from '../../../atenciones/services/atencion';

import {
  ComprobanteResponse,
  ComprobanteService,
} from '../../../comprobantes/services/comprobante';

@Component({
  selector: 'app-cobrar-mesa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cobrar-mesa.html',
  styleUrl: './cobrar-mesa.scss',
})
export class CobrarMesaComponent {

  private readonly comprobanteService = inject(ComprobanteService);

  @Input({ required: true })
  atencion!: AtencionDetalle;

  @Input({ required: true })
  codigoMesa!: string;

  @Input({ required: true })
  totalMesa = 0;

  @Output()
  cerrar = new EventEmitter<void>();

  @Output()
  cobroRealizado = new EventEmitter<ComprobanteResponse>();

  tipoComprobante: 'Boleta' | 'Factura' = 'Boleta';

  metodoPago: 'Efectivo' | 'Yape' | 'Plin' | 'Tarjeta' =
    'Efectivo';

  procesando = false;
  error = '';

  get subtotal(): number {
    return Math.round((this.totalMesa / 1.18) * 100) / 100;
  }

  get igv(): number {
    return Math.round((this.totalMesa - this.subtotal) * 100) / 100;
  }

  confirmarCobro(): void {

    if (this.procesando || this.totalMesa <= 0) {
      return;
    }

    this.procesando = true;
    this.error = '';

    this.comprobanteService.cobrar({
      idAtencion: this.atencion.id,
      tipoComprobante: this.tipoComprobante,
      metodoPago: this.metodoPago,
    }).subscribe({
      next: comprobante => {
        this.procesando = false;
        this.cobroRealizado.emit(comprobante);
      },
      error: error => {
        console.error('Error registrando cobro:', error);

        this.error =
          error.error?.message ||
          error.error?.mensaje ||
          'No se pudo registrar el cobro. Verifica el estado de la atención.';

        this.procesando = false;
      },
    });
  }
}
