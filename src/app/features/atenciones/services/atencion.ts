import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AtencionRequest {
  idMesa: string;
  idCliente: string;
  idMozo: string;
  idReserva: string | null;
}

export interface AtencionResponse {
  id: string;
  codigo: string;
  idMesa: string;
  idCliente: string;
  idMozo: string;
  idReserva: string | null;
  estado: string;
  estadoPago: string;
  aperturaEn: string;
}
export interface AtencionDetalle {
  id: string;
  codigo: string;
  idMesa: string;
  mesa: string;
  idCliente: string;
  cliente: string;
  idMozo: string;
  mozo: string;
  idReserva: string | null;
  estado: string;
  estadoPago: string;
  aperturaEn: string;
  cierreEn: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AtencionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/atenciones`;

  ocuparMesa(request: AtencionRequest): Observable<AtencionResponse> {
    return this.http.post<AtencionResponse>(this.apiUrl, request);
  }
  obtenerDetalle(id: string): Observable<AtencionDetalle> {
    return this.http.get<AtencionDetalle>(
      `${this.apiUrl}/${id}`
    );
  }
}
