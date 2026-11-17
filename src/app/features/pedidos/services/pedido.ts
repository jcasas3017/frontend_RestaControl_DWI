import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PedidoDetalleRequest {
  idPlato: string;
  cantidad: number;
  observaciones: string | null;
}

export interface PedidoRequest {
  idAtencion: string;
  notas: string | null;
  detalles: PedidoDetalleRequest[];
}

export interface PedidoDetalleResponse {
  id: string;
  idPlato: string;
  plato: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  estadoCocina: string;
}

export interface PedidoResponse {
  id: string;
  codigo: string;
  idAtencion: string;
  estado: string;
  creadoEn: string;
  total: number;
  detalles: PedidoDetalleResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/pedidos`;

  listarPorAtencion(idAtencion: string): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(
      `${this.apiUrl}/atencion/${idAtencion}`
    );
  }

  registrar(request: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.apiUrl, request);
  }
}
