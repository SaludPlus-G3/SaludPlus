import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderUsuarioComponent } from '../../shared/header-usuario/header-usuario.component';
import { AuthService } from '../../core/services/auth.service';
import { CitasService, Cita } from '../../core/services/citas.service';

@Component({
  selector: 'app-usuario-doctor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    HeaderUsuarioComponent
  ],
  templateUrl: './usuario-doctor.component.html',
  styleUrls: ['./usuario-doctor.component.css']
})
export class UsuarioDoctorComponent implements OnInit {
  nombreUsuario: string = 'Doctor';
  fechaActual: string;
  fechaSeleccionada: string;

  citasHoy: Cita[] = [];
  citasFecha: Cita[] = [];
  todasLasCitas: Cita[] = [];

  isLoadingCitas: boolean = true;
  errorMessageCitas: string | null = null;
  isLoadingDetalles: boolean = false;
  errorMessageDetalles: string | null = null;
  successMessageDetalles: string | null = null;

  mostrarDetalles: boolean = false;
  citaSeleccionada: Cita | null = null;
  observaciones: string = '';
  medicamentos: string = '';
  examenes: string = '';

  constructor(
    private authService: AuthService,
    private citasService: CitasService,
    private router: Router
  ) {
    const today = new Date();
    this.fechaActual = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    this.fechaSeleccionada = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.nombre_completo) {
      this.nombreUsuario = userInfo.nombre_completo;
    } else if (userInfo && userInfo.email) {
      this.nombreUsuario = userInfo.email;
    }

    this.loadDoctorCitas();
  }

  loadDoctorCitas(): void {
    this.isLoadingCitas = true;
    this.errorMessageCitas = null;
    this.citasService.getDoctorCitas().subscribe({
      next: (citas: Cita[]) => {
        this.todasLasCitas = citas;
        this.filterCitasForToday();
        this.filterCitasForSelectedDate();
        this.isLoadingCitas = false;
      },
      error: (err: any) => {
        this.errorMessageCitas = err.message || 'Error al cargar las citas.';
        this.isLoadingCitas = false;
        console.error('Error al cargar citas del doctor:', err);
      }
    });
  }

  filterCitasForToday(): void {
    const todayString = new Date().toISOString().slice(0, 10);
    this.citasHoy = this.todasLasCitas
      .filter(cita => cita.fecha === todayString)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  filterCitasForSelectedDate(): void {
    this.citasFecha = this.todasLasCitas
      .filter(cita => cita.fecha === this.fechaSeleccionada)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  verAgenda(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.fechaSeleccionada = inputElement.value;
    this.filterCitasForSelectedDate();
  }

  abrirDetalles(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.observaciones = cita.observaciones || '';
    this.medicamentos = cita.medicamentos_recetados || '';
    this.examenes = cita.examenes_solicitados || '';
    this.mostrarDetalles = true;
    this.errorMessageDetalles = null;
    this.successMessageDetalles = null;
  }

  cerrarDetalles(): void {
    this.mostrarDetalles = false;
    this.citaSeleccionada = null;
    this.observaciones = '';
    this.medicamentos = '';
    this.examenes = '';
    this.errorMessageDetalles = null;
    this.successMessageDetalles = null;
  }

  guardarDetalles(): void {
    if (!this.citaSeleccionada || this.isLoadingDetalles) {
      return;
    }

    this.isLoadingDetalles = true;
    this.errorMessageDetalles = null;
    this.successMessageDetalles = null;

    const dataToUpdate: Partial<Cita> = {
      observaciones: this.observaciones,
      medicamentos_recetados: this.medicamentos,
      examenes_solicitados: this.examenes,
    };

    this.citasService.updateCita(this.citaSeleccionada.id, dataToUpdate).subscribe({
      next: (updatedCita: Cita) => {
        this.isLoadingDetalles = false;
        this.successMessageDetalles = 'Detalles de la consulta guardados exitosamente.';
        const indexHoy = this.citasHoy.findIndex(c => c.id === updatedCita.id);
        if (indexHoy !== -1) {
          this.citasHoy[indexHoy] = updatedCita;
        }
        const indexFecha = this.citasFecha.findIndex(c => c.id === updatedCita.id);
        if (indexFecha !== -1) {
          this.citasFecha[indexFecha] = updatedCita;
        }
        const indexTodas = this.todasLasCitas.findIndex(c => c.id === updatedCita.id);
        if (indexTodas !== -1) {
          this.todasLasCitas[indexTodas] = updatedCita;
        }
        
        setTimeout(() => {
          this.cerrarDetalles();
        }, 1500); 
      },
      error: (err: any) => {
        this.isLoadingDetalles = false;
        this.errorMessageDetalles = err.message || 'Error al guardar los detalles de la consulta.';
        console.error('Error al guardar detalles de cita:', err);
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}