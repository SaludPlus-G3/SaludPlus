import { Component, OnInit } from '@angular/core'; // Importa OnInit para el ciclo de vida
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf, *ngFor
import { HeaderUsuarioComponent } from '../../shared/header-usuario/header-usuario.component'; // Importa el componente de encabezado
import { RouterLink } from '@angular/router'; // Si usas routerLink en este componente
import { AuthService } from '../../core/services/auth.service'; // Importa tu AuthService para obtener la info del usuario

@Component({
  selector: 'app-paciente',
  standalone: true, // Indica que es un componente standalone
  imports: [
    CommonModule,
    HeaderUsuarioComponent, // Incluye el componente de encabezado
    RouterLink // Si es necesario para la navegación
  ],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit { // Implementa OnInit para usar ngOnInit
  nombreUsuario: string = 'Paciente'; // Propiedad para almacenar el nombre del usuario, con un valor por defecto
  anioActual = new Date().getFullYear(); // Obtiene el año actual

  // Datos de ejemplo para la próxima cita
  proximaCita = {
    fecha: 'Martes 4 de junio',
    hora: '10:30 hrs',
    doctor: 'Dr. Martínez',
    especialidad: 'Cardiología'
  };

  // Datos de ejemplo para el historial rápido
  historial = [
    { fecha: '10/05', descripcion: 'Consulta Medicina General' },
    { fecha: '22/04', descripcion: 'Control de presión arterial' }
  ];

  // Recomendación de ejemplo
  recomendacion = 'No olvides tomar tu medicamento diario antes del desayuno.';

  constructor(private authService: AuthService) { } // Inyecta el AuthService

  // Método del ciclo de vida que se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    // Intenta obtener la información del usuario logueado desde el AuthService
    const userInfo = this.authService.getUserInfo();
    
    // Si se encontró información del usuario y tiene un nombre completo
    if (userInfo && userInfo.nombre_completo) {
      this.nombreUsuario = userInfo.nombre_completo;
    } else if (userInfo && userInfo.email) {
      // Si no hay nombre_completo, usa el email como un fallback
      this.nombreUsuario = userInfo.email;
    }
    // Si no hay userInfo, la propiedad nombreUsuario se mantendrá con su valor por defecto 'Paciente'
  }

  // Métodos para las acciones de los botones (actualmente solo registran en consola)
  confirmarCita() {
    console.log('Cita confirmada');
    // Aquí iría la lógica para interactuar con el backend para confirmar la cita
  }

  rechazarCita() {
    console.log('Cita rechazada');
    // Aquí iría la lógica para interactuar con el backend para rechazar la cita
  }

  agendarCita() {
    console.log('Agendar nueva cita');
    // Aquí iría la lógica para navegar a la página de agendar cita
  }

  verHistorial() {
    console.log('Ver historial completo');
    // Aquí iría la lógica para navegar a la página del historial completo
  }

  verRecetas() {
    console.log('Ver recetas');
    // Aquí iría la lógica para navegar a la página de recetas
  }
}
