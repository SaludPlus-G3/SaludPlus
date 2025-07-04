import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CitaPaciente {
  id: number;
  nombre_completo: string;
}

export interface CitaDoctor {
  id: number;
  name: string;
  specialty: string;
}

export interface Cita {
  id: number;
  paciente: CitaPaciente;
  doctor: CitaDoctor;
  fecha: string;
  hora: string;
  motivo_consulta: string;
  estado: string;
  observaciones: string | null;
  medicamentos_recetados: string | null;
  examenes_solicitados: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private baseApiUrl = 'http://127.0.0.1:8000/api/'; 
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getDoctorCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseApiUrl}citas/doctor/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCitaDetails(citaId: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseApiUrl}citas/${citaId}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCita(citaId: number, data: Partial<Cita>): Observable<Cita> {
    return this.http.patch<Cita>(`${this.baseApiUrl}citas/${citaId}/`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en CitasService:', error);

    if (error.status === 0) {
      return throwError(() => ({
          message: 'Error de conexión con el servidor. Por favor, intente más tarde.',
          type: 'network'
      }));
    }

    if (error.status === 400) {
        return throwError(() => ({
            message: error.error.detail || 'Errores de validación en el formulario.',
            errors: error.error,
            type: 'validation'
        }));
    }

    if (error.status === 401) {
      return throwError(() => ({
          message: error.error.detail || 'No autorizado. Por favor, inicie sesión.',
          type: 'auth'
      }));
    }

    if (error.status === 403) {
        return throwError(() => ({
            message: error.error.detail || 'Permiso denegado. No tiene acceso a esta cita.',
            type: 'permission'
        }));
    }

    if (error.status === 404) {
        return throwError(() => ({
            message: error.error.detail || 'Cita no encontrada.',
            type: 'not_found'
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
