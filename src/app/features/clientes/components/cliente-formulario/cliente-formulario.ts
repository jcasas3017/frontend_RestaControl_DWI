
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Cliente, ClienteRequest } from '../../services/cliente';

@Component({
  selector: 'app-cliente-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cliente-formulario.html',
  styleUrl: './cliente-formulario.scss'
})
export class ClienteFormulario implements OnChanges {

  @Input() cliente: Cliente | null = null;
  @Input() guardando = false;

  @Output() guardar = new EventEmitter<ClienteRequest>();
  @Output() cancelar = new EventEmitter<void>();

  formulario: ClienteRequest = this.crearFormularioVacio();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente']) {
      this.formulario = this.cliente
        ? {
            codigo: this.cliente.codigo,
            nombres: this.cliente.nombres,
            apellidos: this.cliente.apellidos,
            documento: this.cliente.documento,
            telefono: this.cliente.telefono,
            email: this.cliente.email,
            direccion: this.cliente.direccion
          }
        : this.crearFormularioVacio();
    }
  }

  private crearFormularioVacio(): ClienteRequest {
    return {
      codigo: '',
      nombres: '',
      apellidos: '',
      documento: '',
      telefono: '',
      email: '',
      direccion: ''
    };
  }

  enviarFormulario(): void {
    if (
      !this.formulario.nombres.trim() ||
      !this.formulario.apellidos.trim() ||
      !this.formulario.documento.trim()
    ) {
      return;
    }

    this.guardar.emit({
      codigo: this.formulario.codigo,
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      documento: this.formulario.documento.trim(),
      telefono: this.formulario.telefono?.trim() || null,
      email: this.formulario.email?.trim() || null,
      direccion: this.formulario.direccion?.trim() || null
    });
  }

  cancelarFormulario(): void {
    this.cancelar.emit();
  }
}
