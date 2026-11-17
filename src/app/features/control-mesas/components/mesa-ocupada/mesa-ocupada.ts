import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import {
  AtencionDetalle,
  AtencionService,
} from '../../../atenciones/services/atencion';

import {
  PedidoResponse,
  PedidoService,
} from '../../../pedidos/services/pedido';

import { ControlMesa } from '../../services/control-mesa';
import { AgregarPlatosComponent } from '../agregar-platos/agregar-platos';
import { CobrarMesaComponent } from '../cobrar-mesa/cobrar-mesa';
import {
  ComprobanteResponse,
} from '../../../comprobantes/services/comprobante';

@Component({
  selector: 'app-mesa-ocupada',
  standalone: true,
  imports: [CommonModule, AgregarPlatosComponent, CobrarMesaComponent],
  templateUrl: './mesa-ocupada.html',
  styleUrl: './mesa-ocupada.scss',
})
export class MesaOcupadaComponent implements OnInit {

  private readonly atencionService = inject(AtencionService);
  private readonly pedidoService = inject(PedidoService);

  @Input({ required: true }) mesa!: ControlMesa;

  @Output() cerrar = new EventEmitter<void>();

  atencion: AtencionDetalle | null = null;

  pedidos: PedidoResponse[] = [];

  mostrarAgregarPlatos = false;

  cargando = false;
  cargandoPedidos = false;

  error = '';
  errorPedidos = '';

  ngOnInit(): void {
    this.cargarAtencion();
  }

  cargarAtencion(): void {
    if (!this.mesa.idAtencion) {
      this.error = 'No se encontró una atención asociada a esta mesa.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.atencionService.obtenerDetalle(this.mesa.idAtencion)
      .subscribe({
        next: respuesta => {
          this.atencion = respuesta;
          this.cargando = false;

          // Consultar pedidos de esta atención
          this.cargarPedidos();
        },
        error: error => {
          console.error('Error consultando atención:', error);

          this.error =
            'No se pudo consultar el detalle de la atención.';

          this.cargando = false;
        },
      });
  }

  cargarPedidos(): void {
    if (!this.atencion) {
      return;
    }

    this.cargandoPedidos = true;
    this.errorPedidos = '';

    this.pedidoService.listarPorAtencion(this.atencion.id)
      .subscribe({
        next: respuesta => {
          this.pedidos = respuesta;
          this.cargandoPedidos = false;
        },
        error: error => {
          console.error('Error consultando pedidos:', error);

          this.errorPedidos =
            'No se pudieron cargar los pedidos de la mesa.';

          this.cargandoPedidos = false;
        },
      });
  }

  get totalMesa(): number {
    return this.pedidos.reduce(
      (total, pedido) => total + Number(pedido.total),
      0
    );
  }

  get cantidadPlatos(): number {
    return this.pedidos.reduce(
      (total, pedido) =>
        total + pedido.detalles.reduce(
          (subtotal, detalle) => subtotal + detalle.cantidad,
          0
        ),
      0
    );
  }

  abrirAgregarPlatos(): void {
    if (!this.atencion) {
      return;
    }

    this.mostrarAgregarPlatos = true;
  }

  pedidoRegistrado(): void {
    this.mostrarAgregarPlatos = false;

    // Actualizar pedidos después de registrar
    this.cargarPedidos();
  }

  mostrarCobrarMesa = false;

  abrirCobrarMesa(): void {
    if (
      !this.atencion ||
      this.cargandoPedidos ||
      this.errorPedidos ||
      this.pedidos.length === 0 ||
      this.totalMesa <= 0
    ) {
      return;
    }

    this.mostrarCobrarMesa = true;
  }
  @Output()
  cobrado = new EventEmitter<ComprobanteResponse>();

  cobroConfirmado(comprobante: ComprobanteResponse): void {
    this.mostrarCobrarMesa = false;
    this.cobrado.emit(comprobante);
  }

}
