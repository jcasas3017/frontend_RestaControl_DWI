import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  PedidoService,
  PedidoDetalleRequest,
} from '../../../pedidos/services/pedido';

import {
  PlatoService,
  Plato,
} from '../../../platos/services/plato';

interface ItemPedido {
  idPlato: string;
  nombre: string;
  cantidad: number;
  precio: number;
  observaciones: string;
}

@Component({
  selector: 'app-agregar-platos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-platos.html',
  styleUrl: './agregar-platos.scss',
})
export class AgregarPlatosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly platoService = inject(PlatoService);

  @Input({ required: true }) idAtencion!: string;
  @Input({ required: true }) codigoMesa!: string;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  platos: Plato[] = [];
  items: ItemPedido[] = [];

  idPlatoSeleccionado = '';
  cantidad = 1;
  observaciones = '';
  notas = '';

  cargando = false;
  guardando = false;
  error = '';

  ngOnInit(): void {
    this.cargarPlatos();
  }

  cargarPlatos(): void {
    this.cargando = true;
    this.error = '';

    this.platoService.listar().subscribe({
      next: (respuesta) => {
        this.platos = respuesta.filter(
          plato => plato.activo === true
            && plato.disponible === true
        );

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al consultar platos:', error);
        this.error = 'No se pudo cargar el catálogo de platos.';
        this.cargando = false;
      },
    });
  }

  agregar(): void {
    this.error = '';

    const plato = this.platos.find(
      item => item.id === this.idPlatoSeleccionado
    );

    if (!plato) {
      this.error = 'Seleccione un plato.';
      return;
    }

    if (!Number.isInteger(this.cantidad) || this.cantidad <= 0) {
      this.error = 'La cantidad debe ser mayor que cero.';
      return;
    }

    this.items.push({
      idPlato: plato.id,
      nombre: plato.nombre,
      cantidad: this.cantidad,
      precio: Number(plato.precio),
      observaciones: this.observaciones.trim(),
    });

    this.idPlatoSeleccionado = '';
    this.cantidad = 1;
    this.observaciones = '';
  }

  quitar(index: number): void {
    this.items.splice(index, 1);
  }

  subtotal(item: ItemPedido): number {
    return item.precio * item.cantidad;
  }

  get total(): number {
    return this.items.reduce(
      (acumulado, item) => acumulado + this.subtotal(item),
      0
    );
  }

  registrarPedido(): void {
    if (this.guardando || this.items.length === 0) {
      return;
    }

    this.guardando = true;
    this.error = '';

    const detalles: PedidoDetalleRequest[] = this.items.map(
      item => ({
        idPlato: item.idPlato,
        cantidad: item.cantidad,
        observaciones: item.observaciones || null,
      })
    );

    this.pedidoService.registrar({
      idAtencion: this.idAtencion,
      notas: this.notas.trim() || null,
      detalles,
    }).subscribe({
      next: (respuesta) => {
        console.log('Pedido registrado:', respuesta);
        this.guardando = false;
        this.guardado.emit();
      },
      error: (error) => {
        console.error('Error al registrar pedido:', error);

        this.error =
          error.error?.message ||
          error.error?.mensaje ||
          'No se pudo registrar el pedido.';

        this.guardando = false;
      },
    });
  }
}
