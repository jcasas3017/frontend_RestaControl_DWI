import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { Cliente, ClienteService } from '../../../clientes/services/cliente';
import { Usuario, UsuarioService } from '../../../usuarios/services/usuario';
import { AtencionService } from '../../../atenciones/services/atencion';
import { ControlMesa } from '../../services/control-mesa';

@Component({
  selector: 'app-ocupar-mesa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ocupar-mesa.html',
  styleUrl: './ocupar-mesa.scss',
})
export class OcuparMesaComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly atencionService = inject(AtencionService);

  @Input({ required: true }) mesa!: ControlMesa;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  clientes: Cliente[] = [];
  mozos: Usuario[] = [];

  idCliente = '';
  idMozo = '';
  busquedaCliente = '';

  cargando = false;
  guardando = false;
  error = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  get clientesFiltrados(): Cliente[] {
    const busqueda = this.busquedaCliente.trim().toLowerCase();

    return this.clientes.filter(cliente => {
      const texto = [
        cliente.codigo,
        cliente.documento,
        cliente.nombres,
        cliente.apellidos,
      ].join(' ').toLowerCase();

      return cliente.activo && texto.includes(busqueda);
    });
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    forkJoin({
      clientes: this.clienteService.listar(),
      usuarios: this.usuarioService.listar(),
    })
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: ({ clientes, usuarios }) => {
          this.clientes = clientes;

          this.mozos = usuarios.filter(usuario =>
            usuario.activo &&
            ['MOZO', 'ROLE_MOZO'].includes(
              (usuario.rol ?? '').trim().toUpperCase()
            )
          );
        },
        error: error => {
          console.error('Error cargando datos de atención:', error);
          this.error = 'No se pudieron cargar los clientes o mozos.';
        },
      });
  }

  ocuparMesa(): void {
    if (this.guardando) return;

    if (!this.idCliente || !this.idMozo) {
      this.error = 'Seleccione un cliente y un mozo.';
      return;
    }

    this.guardando = true;
    this.error = '';

    this.atencionService.ocuparMesa({
      idMesa: this.mesa.id,
      idCliente: this.idCliente,
      idMozo: this.idMozo,
      idReserva: null,
    })
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: respuesta => {
          console.log('Atención registrada:', respuesta);
          this.guardado.emit();
        },
        error: error => {
          console.error('Error al ocupar mesa:', error);

          this.error =
            error.error?.message ||
            error.error?.mensaje ||
            'No se pudo registrar la ocupación de la mesa.';
        },
      });
  }
}
