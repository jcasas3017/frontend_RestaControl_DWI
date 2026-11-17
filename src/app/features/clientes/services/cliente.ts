
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Cliente {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  activo: boolean;
}

export interface ClienteRequest {
  codigo: string;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/clientes`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.apiUrl}/${id}`
    );
  }

  obtenerPorCodigo(codigo: string): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.apiUrl}/codigo/${encodeURIComponent(codigo)}`
    );
  }

  registrar(cliente: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.apiUrl,
      cliente
    );
  }

  actualizar(
    id: string,
    cliente: ClienteRequest
  ): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/${id}`,
      cliente
    );
  }


cambiarEstado(id: string): Observable<Cliente> {
  return this.http.patch<Cliente>(
    `${this.apiUrl}/${id}/estado`,
    {}
  );
}

}
