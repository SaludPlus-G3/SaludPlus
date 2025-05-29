import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-usuario.component.html',
  styleUrls: ['./header-usuario.component.css']
})
export class HeaderUsuarioComponent {
  nombreUsuario = 'Juan Pérez';
  logoPath = 'assets/LogoSaludPlus.png';

  constructor(private router: Router) {}

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.router.navigate(['/login']);
  }
}