import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-header-usuario',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header-usuario.component.html',
  styleUrls: ['./header-usuario.component.css']
})
export class HeaderUsuarioComponent implements OnInit {
  @Input() nombreUsuario: string | null = 'Usuario';

  logoPath = 'assets/LogoSaludPlus.png';

  constructor(
    private router: Router,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}