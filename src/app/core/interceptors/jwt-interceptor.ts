
import { inject } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';

import { AuthService } from '../services/auth';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  // Solo agregar JWT a las solicitudes de nuestro backend.
  if (
    token &&
    req.url.startsWith(`${environment.apiUrl}/`) &&
    !req.url.endsWith('/auth')
  ) {
    const requestWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(requestWithToken);
  }

  return next(req);
};
