
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Categoria {
  id: string;
  codigo: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface CategoriaRequest {
  codigo: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/categorias`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(
      `${this.apiUrl}/${id}`
    );
  }

  registrar(categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(
      this.apiUrl,
      categoria
    );
  }

  actualizar(
    id: string,
    categoria: CategoriaRequest
  ): Observable<Categoria> {
    return this.http.put<Categoria>(
      `${this.apiUrl}/${id}`,
      categoria
    );
  }
}
