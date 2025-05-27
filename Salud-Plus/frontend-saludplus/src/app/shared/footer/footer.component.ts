import { Component } from '@angular/core';
// ...existing code...
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// ...existing code...
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
