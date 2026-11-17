import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ControlMesa,
  ControlMesaService,
  EstadoVisualMesa,
} from '../../services/control-mesa';
import { OcuparMesaComponent } from '../../components/ocupar-mesa/ocupar-mesa';
import { MesaOcupadaComponent } from '../../components/mesa-ocupada/mesa-ocupada';
import {
  ComprobanteResponse,
} from '../../../comprobantes/services/comprobante';

@Component({
  selector: 'app-control-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule, OcuparMesaComponent,MesaOcupadaComponent],
  templateUrl: './control-mesas.html',
  styleUrl: './control-mesas.scss',
})
export class ControlMesasComponent implements OnInit {
  private readonly controlMesaService = inject(ControlMesaService);
  mesaSeleccionada: ControlMesa | null = null;
  mesaOcupadaSeleccionada: ControlMesa | null = null;
  fecha = '';
  hora = '';

  mesas: ControlMesa[] = [];
  cargando = false;
  error = '';

  ngOnInit(): void {
    const ahora = new Date();

    this.fecha = this.formatearFecha(ahora);
    this.hora = this.formatearHora(ahora);

    this.consultar();
  }

  consultar(): void {
    if (!this.fecha || !this.hora) {
      this.error = 'Seleccione una fecha y hora.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.controlMesaService.consultar(this.fecha, this.hora).subscribe({
      next: (respuesta) => {
        this.mesas = respuesta;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al consultar las mesas:', error);
        this.error = 'No se pudo consultar la disponibilidad de las mesas.';
        this.mesas = [];
        this.cargando = false;
      },
    });
  }

  contar(estado: EstadoVisualMesa): number {
    return this.mesas.filter(
      (mesa) => mesa.estadoVisual === estado
    ).length;
  }

  claseEstado(estado: EstadoVisualMesa): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'disponible';
      case 'OCUPADA':
        return 'ocupada';
      case 'RESERVADA':
        return 'reservada';
      case 'NO_DISPONIBLE':
        return 'no-disponible';
      default:
        return '';
    }
  }

  nombreEstado(estado: EstadoVisualMesa): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'OCUPADA':
        return 'Ocupada';
      case 'RESERVADA':
        return 'Reservada';
      case 'NO_DISPONIBLE':
        return 'No disponible';
      default:
        return estado;
    }
  }

  seleccionarMesa(mesa: ControlMesa): void {
    if (mesa.estadoVisual === 'DISPONIBLE') {
      this.mesaSeleccionada = mesa;
      this.mesaOcupadaSeleccionada = null;
      return;
    }

    if (mesa.estadoVisual === 'OCUPADA') {
      this.mesaOcupadaSeleccionada = mesa;
      this.mesaSeleccionada = null;
      return;
    }
  }
  cerrarMesaOcupada(): void {
    this.mesaOcupadaSeleccionada = null;
  }
  cerrarModal(): void {
    this.mesaSeleccionada = null;
  }

  atencionRegistrada(): void {
    this.mesaSeleccionada = null;

    const ahora = new Date();
    this.fecha = this.formatearFecha(ahora);
    this.hora = this.formatearHora(ahora);

    this.consultar();
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  private formatearHora(fecha: Date): string {
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${horas}:${minutos}`;
  }

  ultimoComprobante: ComprobanteResponse | null = null;

  mesaCobrada(comprobante: ComprobanteResponse): void {
    this.ultimoComprobante = comprobante;
    this.mesaOcupadaSeleccionada = null;

    this.consultar();
  }
}
