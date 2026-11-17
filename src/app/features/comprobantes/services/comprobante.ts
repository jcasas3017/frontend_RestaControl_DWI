import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ComprobanteRequest {
  idAtencion: string;
  tipoComprobante: 'Boleta' | 'Factura';
  metodoPago: 'Efectivo' | 'Yape' | 'Plin' | 'Tarjeta';
}

export interface ComprobanteResponse {
  id: string;
  numeroComprobante: string;
  idAtencion: string;
  tipoComprobante: string;
  metodoPago: string;
  montoSubtotal: number;
  montoIgv: number;
  montoDescuento: number;
  montoTotal: number;
  estado: string;
  fechaEmision: string;
}

@Injectable({
  providedIn: 'root',
})
export class ComprobanteService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/comprobantes`;

  cobrar(
    request: ComprobanteRequest
  ): Observable<ComprobanteResponse> {

    return this.http.post<ComprobanteResponse>(
      `${this.apiUrl}/cobrar`,
      request
    );
  }
}
