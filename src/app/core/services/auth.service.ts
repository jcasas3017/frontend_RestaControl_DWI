import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'restacontrol_token';

  login(username: string, password: string): Observable<string> {
    return this.http.post('/auth', { username, password }, {
      responseType: 'text'
    }).pipe(
      tap(token => localStorage.setItem(this.tokenKey, token.trim()))
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}