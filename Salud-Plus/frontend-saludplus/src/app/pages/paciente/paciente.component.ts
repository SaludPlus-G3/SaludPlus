import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderUsuarioComponent } from '../../shared/header-usuario/header-usuario.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, HeaderUsuarioComponent, RouterLink],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent {
  nombreUsuario = 'Juan';
  anioActual = new Date().getFullYear();

  proximaCita = {
    fecha: 'Martes 4 de junio',
    hora: '10:30 hrs',
    doctor: 'Dr. Martínez',
    especialidad: 'Cardiología'
  };

  historial = [
    { fecha: '10/05', descripcion: 'Consulta Medicina General' },
    { fecha: '22/04', descripcion: 'Control de presión arterial' }
  ];

  recomendacion = 'No olvides tomar tu medicamento diario antes del desayuno.';

  confirmarCita() {
    console.log('Cita confirmada');
  }

  rechazarCita() {
    console.log('Cita rechazada');
  }

  agendarCita() {
    console.log('Agendar nueva cita');
  }

  verHistorial() {
    console.log('Ver historial completo');
  }

  verRecetas() {
    console.log('Ver recetas');
  }
}