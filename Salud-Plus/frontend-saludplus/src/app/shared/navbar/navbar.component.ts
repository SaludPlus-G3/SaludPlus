import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// ...existing code...
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// ...existing code...
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/doctors', label: 'Nuestros Médicos' },
    { path: '/schedule', label: 'Agenda' },
    { path: '/login', label: 'Cuenta' } // Cambiado de "Registro" a "Cuenta"
  ];
}
