import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// ...existing code...
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// ...existing code...
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  title = 'Bienvenido a SaludPlus';
  buttonText = 'Agenda tu cita';
}
