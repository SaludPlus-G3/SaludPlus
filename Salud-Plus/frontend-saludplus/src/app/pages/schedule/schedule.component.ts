import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService, Reserva } from './schedule.services';

interface Doctor {
  name: string;
  specialty: string;
  university: string;
  image: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent {
  reservaForm: FormGroup;
  mensaje: string = '';

  doctors: Doctor[] = [
    { name: 'Dr. Carlos Méndez', specialty: 'Medicina General', university: 'Universidad de Chile', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Dra. Ana Fernández', specialty: 'Medicina General', university: 'Universidad Católica', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Dr. Roberto Vargas', specialty: 'Cardiología', university: 'Universidad de Valparaíso', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { name: 'Dra. Marcela Soto', specialty: 'Neurología', university: 'Universidad de Concepción', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Dra. Patricia López', specialty: 'Pediatría', university: 'Universidad de Santiago', image: 'https://randomuser.me/api/portraits/women/28.jpg' },
    { name: 'Dr. Jorge Silva', specialty: 'Pediatría', university: 'Universidad Andrés Bello', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { name: 'Dra. Carolina Rojas', specialty: 'Dermatología', university: 'Universidad del Desarrollo', image: 'https://randomuser.me/api/portraits/women/63.jpg' },
    { name: 'Dr. Felipe González', specialty: 'Oftalmología', university: 'Universidad de los Andes', image: 'https://randomuser.me/api/portraits/men/41.jpg' },
    { name: 'Dra. Daniela Muñoz', specialty: 'Psiquiatría', university: 'Universidad Diego Portales', image: 'https://randomuser.me/api/portraits/women/53.jpg' }
  ];

  specialties = [
    'Medicina General',
    'Cardiología',
    'Neurología',
    'Pediatría',
    'Dermatología',
    'Oftalmología',
    'Psiquiatría'
  ];

  selectedSpecialty = '';
  selectedDoctor = '';

  showNotification = false;

  constructor(private fb: FormBuilder, private scheduleService: ScheduleService) {
    this.reservaForm = this.fb.group({
      nombre_paciente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      doctor: ['', Validators.required],
      especialidad: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
    });
  }

  get filteredDoctors() {
    return this.selectedSpecialty
      ? this.doctors.filter(d => d.specialty === this.selectedSpecialty)
      : this.doctors;
  }

  onSubmit() {
    if (this.reservaForm.valid) {
      this.scheduleService.crearReserva(this.reservaForm.value).subscribe({
        next: () => {
          this.mensaje = 'Reserva realizada con éxito';
          this.reservaForm.reset();
        },
        error: () => {
          this.mensaje = 'Error al reservar, intente más tarde';
        }
      });
      setTimeout(() => this.mensaje = '', 3000);
    }
  }
}