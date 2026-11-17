
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Usuario {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  username: string;
  rol: string;
  activo: boolean;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface UsuarioRequest {
  codigo: string;
  nombres: string;
  apellidos: string;
  username: string;
  password: string;
  rol: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<Usuario> {
    return this.http.get<Usuario>(
      `${this.apiUrl}/codigo/${encodeURIComponent(codigo)}`
    );
  }

  registrar(request: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, request);
  }

  actualizar(
    id: string,
    request: UsuarioRequest
  ): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  cambiarEstado(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(
      `${this.apiUrl}/${id}/estado`,
      {}
    );
  }
}
