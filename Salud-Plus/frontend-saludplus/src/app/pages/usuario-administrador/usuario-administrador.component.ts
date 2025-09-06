import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuario-administrador.component.html',
  styleUrls: ['./usuario-administrador.component.css']
})
export class UsuarioAdministradorComponent {
  fechaSeleccionada = new Date().toISOString().substring(0, 10);

  doctors = [
    {
      name: 'Dr. Carlos Méndez',
      specialty: 'Medicina General',
      university: 'Universidad de Chile',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Dra. Ana Fernández',
      specialty: 'Medicina General',
      university: 'Universidad Católica',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Dr. Roberto Vargas',
      specialty: 'Cardiología',
      university: 'Universidad de Valparaíso',
      image: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    {
      name: 'Dra. Marcela Soto',
      specialty: 'Neurología',
      university: 'Universidad de Concepción',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      name: 'Dra. Patricia López',
      specialty: 'Pediatría',
      university: 'Universidad de Santiago',
      image: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      name: 'Dr. Jorge Silva',
      specialty: 'Pediatría',
      university: 'Universidad Andrés Bello',
      image: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      name: 'Dra. Carolina Rojas',
      specialty: 'Dermatología',
      university: 'Universidad del Desarrollo',
      image: 'https://randomuser.me/api/portraits/women/63.jpg'
    },
    {
      name: 'Dr. Felipe González',
      specialty: 'Oftalmología',
      university: 'Universidad de los Andes',
      image: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      name: 'Dra. Daniela Muñoz',
      specialty: 'Psiquiatría',
      university: 'Universidad Diego Portales',
      image: 'https://randomuser.me/api/portraits/women/53.jpg'
    }
  ];

  todasLasCitas = [
    { fecha: '2024-06-01', doctor: 'Dr. Carlos Méndez', paciente: 'Juan Pérez', hora: '09:00', estado: 'Finalizada' },
    { fecha: '2024-06-01', doctor: 'Dra. Ana Fernández', paciente: 'Ana Soto', hora: '10:30', estado: 'No realizada' },
    { fecha: '2024-06-01', doctor: 'Dr. Carlos Méndez', paciente: 'Luis Mora', hora: '11:00', estado: 'Reagendada' },
    { fecha: '2024-06-02', doctor: 'Dr. Roberto Vargas', paciente: 'Paula Ruiz', hora: '08:00', estado: 'Finalizada' },
    { fecha: '2024-06-02', doctor: 'Dra. Marcela Soto', paciente: 'Pedro Díaz', hora: '12:00', estado: 'Finalizada' }
  ];

  citasPorDoctor: { [doctorName: string]: { paciente: string; hora: string; estado: string }[] } = {};

  ngOnInit() {
    this.filtrarPorFecha();
  }

  filtrarPorFecha(event?: Event) {
    if (event) {
      const input = event.target as HTMLInputElement;
      this.fechaSeleccionada = input.value;
    }

    this.citasPorDoctor = {};

    const citasDelDia = this.todasLasCitas.filter(c => c.fecha === this.fechaSeleccionada);
    for (const cita of citasDelDia) {
      if (!this.citasPorDoctor[cita.doctor]) {
        this.citasPorDoctor[cita.doctor] = [];
      }
      this.citasPorDoctor[cita.doctor].push({
        paciente: cita.paciente,
        hora: cita.hora,
        estado: cita.estado
      });
    }
  }

  tieneCitas(nombreDoctor: string): boolean {
    return !!this.citasPorDoctor[nombreDoctor]?.length;
  }
  nombreUsuario = 'Administrador';
  logoPath = 'assets/LogoSaludPlus.png';

  constructor(private router: Router) {}

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.router.navigate(['/login']);
  }
}
