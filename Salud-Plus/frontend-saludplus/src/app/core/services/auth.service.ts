import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginResponse {
  access: string;
  refresh: string;
  id: number;
  email: string;
  nombre_completo: string;
  is_doctor?: boolean;
  doctor_id?: number;
  doctor_especialidad?: string;
  status?: string;
  message?: string;
}

export interface RegisterResponse {
  status: string;
  message?: string;
  user?: {
    id: number;
    email: string;
    nombre_completo: string;
  };
  tokens?: {
    access: string;
    refresh: string;
  };
  errors?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = 'http://127.0.0.1:8000/api/';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  registerPaciente(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<RegisterResponse> {
    const backendData = {
      nombre_completo: userData.name,
      email: userData.email,
      password: userData.password,
      password2: userData.confirmPassword
    };

    return this.http.post<RegisterResponse>(`${this.baseApiUrl}registro/`, backendData)
      .pipe(
        catchError(this.handleError)
      );
  }

  loginPaciente(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseApiUrl}login/`, credentials)
      .pipe(
        tap(response => {
          if (response && response.access && response.refresh) {
            if (this.isBrowser) {
              localStorage.setItem('access_token', response.access);
              localStorage.setItem('refresh_token', response.refresh);

              const userInfoToStore = {
                  id: response.id,
                  email: response.email,
                  nombre_completo: response.nombre_completo,
                  is_doctor: response.is_doctor,
                  doctor_id: response.doctor_id,
                  doctor_especialidad: response.doctor_especialidad
              };
              localStorage.setItem('user_info', JSON.stringify(userInfoToStore));
            }
          } else {
              console.warn('Login exitoso, pero la respuesta del servidor no contenía tokens esperados o información del usuario.', response);
          }
        }),
        catchError(this.handleError)
      );
  }

  getUserInfo(): { id: number; email: string; nombre_completo?: string; is_doctor?: boolean; doctor_id?: number; doctor_especialidad?: string; } | null {
    if (this.isBrowser) {
      const userInfoString = localStorage.getItem('user_info');
      if (userInfoString) {
        try {
          return JSON.parse(userInfoString);
        } catch (e) {
          console.error('Error parseando user_info de localStorage', e);
          return null;
        }
      }
    }
    return null;
  }

  getAccessToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return !!this.getAccessToken();
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en AuthService:', error);

    if (error.status === 0) {
      return throwError(() => ({
          message: 'Error de conexión con el servidor. Por favor, intente más tarde.',
          type: 'network'
      }));
    }

    if (error.status === 400) {
        return throwError(() => ({
            message: error.error.detail || 'Errores de validación. Por favor, revise sus datos.',
            errors: error.error,
            type: 'validation'
        }));
    }

    if (error.status === 401) {
      return throwError(() => ({
          message: error.error.detail || 'Credenciales inválidas. Por favor, revise su email y contraseña.',
          type: 'auth'
      }));
    }

    if (error.status >= 500) {
      return throwError(() => ({
          message: 'Ocurrió un error interno del servidor. Por favor, intente de nuevo.',
          type: 'server'
      }));
    }

    return throwError(() => ({
        message: error.message || 'Ocurrió un error inesperado. Inténtelo de nuevo.',
        type: 'unknown'
    }));
  }
}
