
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Mesa {
  id: string;
  codigo: string;
  capacidad: number;
  ubicacion: string | null;
  activa: boolean;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface MesaRequest {
  codigo: string;
  capacidad: number;
  ubicacion: string;
  activa: boolean;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/mesas`;

  listar(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  registrar(request: MesaRequest): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, request);
  }

  actualizar(
    id: string,
    request: MesaRequest
  ): Observable<Mesa> {
    return this.http.put<Mesa>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  cambiarEstado(id: string): Observable<Mesa> {
    return this.http.patch<Mesa>(
      `${this.apiUrl}/${id}/estado`,
      {}
    );
  }
}
