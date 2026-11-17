import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type EstadoVisualMesa =
  | 'DISPONIBLE'
  | 'OCUPADA'
  | 'RESERVADA'
  | 'NO_DISPONIBLE';

export interface ControlMesa {
  id: string;
  codigo: string;
  capacidad: number;
  ubicacion: string | null;
  activa: boolean;
  estado: string;
  estadoVisual: EstadoVisualMesa;
  idAtencion: string | null;
  idReserva: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ControlMesaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/control-mesas`;

  consultar(fecha: string, hora: string): Observable<ControlMesa[]> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('hora', hora);

    return this.http.get<ControlMesa[]>(this.apiUrl, { params });
  }
}
