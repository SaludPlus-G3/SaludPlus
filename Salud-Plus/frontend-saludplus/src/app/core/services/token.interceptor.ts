import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();

  console.log(`[Interceptor] Interceptando solicitud a: ${req.url}`);
  console.log(`[Interceptor] Token de acceso obtenido: ${accessToken ? 'Sí' : 'No'}`);

  if (accessToken) {
    console.log('[Interceptor] Clonando solicitud y añadiendo Authorization header...');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('[Interceptor] Solicitud clonada. Nuevo Authorization header:', req.headers.get('Authorization'));
  } else {
    console.log('[Interceptor] No hay token de acceso, la solicitud continuará sin Authorization header.');
  }

  return next(req);
};
