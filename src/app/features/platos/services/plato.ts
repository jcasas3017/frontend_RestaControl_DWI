
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface Plato {
  id: string;
  codigo: string;
  idCategoria: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  disponible: boolean;
  activo: boolean;
}

export interface PlatoRequest {
  codigo: string;
  idCategoria: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  disponible: boolean;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlatoService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/platos`;

  listar(): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Plato> {
    return this.http.get<Plato>(
      `${this.apiUrl}/${id}`
    );
  }

  obtenerPorCodigo(codigo: string): Observable<Plato> {
    return this.http.get<Plato>(
      `${this.apiUrl}/codigo/${encodeURIComponent(codigo)}`
    );
  }

  registrar(plato: PlatoRequest): Observable<Plato> {
    return this.http.post<Plato>(
      this.apiUrl,
      plato
    );
  }

  actualizar(id: string, plato: PlatoRequest): Observable<Plato> {
    return this.http.put<Plato>(
      `${this.apiUrl}/${id}`,
      plato
    );
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  cambiarEstado(id: string): Observable<Plato> {
    return this.http.patch<Plato>(
      `${this.apiUrl}/${id}/estado`,
      {}
    );
  }
}
