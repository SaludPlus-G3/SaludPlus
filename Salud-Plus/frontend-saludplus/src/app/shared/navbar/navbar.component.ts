import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// ...existing code...
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import path from 'path';
// ...existing code...
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/doctors', label: 'Nuestros Médicos' },
    { path: '/schedule', label: 'Agenda' },
    { path: '/login', label: 'Cuenta' }, // Cambiado de "Registro" a "Cuenta"
    { path: '/paciente', label: 'Paciente'},
    { path: '/usuario-doctor', label: 'Doctores'},
    {path: '/usuario-administrador', label: 'Administrador'}
  ];
}
