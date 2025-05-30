import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderUsuarioComponent } from '../../shared/header-usuario/header-usuario.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderUsuarioComponent,RouterLink],
  templateUrl: './usuario-doctor.component.html',
  styleUrls: ['./usuario-doctor.component.css']
})
export class UsuarioDoctorComponent {
  nombreDoctor = 'Martínez';
  fechaActual = new Date().toLocaleDateString();
  fechaSeleccionada = new Date().toISOString().substring(0, 10);

  pacientesHoy = [
    { nombre: 'Juan Pérez', hora: '10:00', motivo: 'Control General' },
    { nombre: 'Ana Soto', hora: '11:30', motivo: 'Dolor de cabeza' }
  ];

 agenda: { [fecha: string]: { nombre: string; hora: string; motivo: string }[] } = {
  '2024-06-01': [
    { nombre: 'Luis Rodríguez', hora: '09:00', motivo: 'Chequeo preoperatorio' },
    { nombre: 'Marta González', hora: '11:00', motivo: 'Examen de rutina' }
  ],
  '2024-06-02': []
};


  pacientesFecha: { nombre: string; hora: string; motivo: string }[] = [];

  verAgenda(event: Event) {
  const input = event.target as HTMLInputElement;
  this.fechaSeleccionada = input.value;

  // Asegura que pacientesFecha siempre sea un array
  this.pacientesFecha = this.agenda[this.fechaSeleccionada] ?? [];
}

nombreUsuario = 'Carlos Mendez';
  logoPath = 'assets/LogoSaludPlus.png';

  constructor(private router: Router) {}

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.router.navigate(['/login']);
  }

}
