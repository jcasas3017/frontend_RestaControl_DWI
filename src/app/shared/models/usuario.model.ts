export interface Usuario {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  username: string;
  rol: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface UsuarioRequest {
  codigo: string;
  nombres: string;
  apellidos: string;
  username: string;
  password?: string;
  rol: string;
  activo: boolean;
}
