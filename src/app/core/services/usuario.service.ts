import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioRequest } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/usuarios';

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  listarActivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/activos`);
  }

  buscarPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  registrar(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(
    id: string,
    usuario: UsuarioRequest
  ): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      usuario
    );
  }

  cambiarEstado(id: string, activo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(
      `${this.apiUrl}/${encodeURIComponent(id)}/estado`,
      { activo }
    );
  }
}
