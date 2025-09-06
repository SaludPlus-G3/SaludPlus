import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  nombre_paciente: string;
  email: string;
  doctor: string;
  especialidad: string;
  fecha: string;
  hora: string;
}

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private apiUrl = 'http://localhost:8000/api/reservas/'; // Cambia la URL si tu backend es diferente

  constructor(private http: HttpClient) {}

  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }
}