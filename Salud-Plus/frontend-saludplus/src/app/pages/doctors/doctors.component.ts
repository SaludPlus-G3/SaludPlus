import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Doctor {
  name: string;
  specialty: string;
  university: string;
  image: string;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [
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

  filteredDoctors: Doctor[] = [];

  ngOnInit() {
    // Mostrar todos los médicos inicialmente
    this.filteredDoctors = [...this.doctors];
  }

  filterDoctors(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const specialty = selectElement.value;
    
    if (specialty === 'all') {
      this.filteredDoctors = [...this.doctors];
    } else {
      this.filteredDoctors = this.doctors.filter(doctor => doctor.specialty === specialty);
    }
  }
}
