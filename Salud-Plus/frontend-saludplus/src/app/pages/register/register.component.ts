// src/app/pages/register/register.component.ts

import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
// Asegúrate que la ruta de AuthService es correcta
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string | null = null; // Para el mensaje de éxito
  errorMessage: string | null = null; // Para errores generales (conexión, servidor)
  validationErrors: any = {}; // Para errores específicos de campo del backend
  isLoading: boolean = false;
  showPassword1: boolean = false; // Controla la visibilidad de la primera contraseña
  showPassword2: boolean = false; // Controla la visibilidad de la confirmación de contraseña


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Validador de fortaleza de contraseña: requiere mayúscula, número y un carácter especial
  private passwordStrengthValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null; // Si no hay valor, el error de 'required' se encargará

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    // Incluye una variedad común de caracteres especiales
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    // Si no cumple con TODAS las condiciones, retorna el error
    const valid = hasUpperCase && hasNumber && hasSpecialChar;

    return !valid ? { passwordStrength: true } : null;
  }

  // Validador de coincidencia de contraseñas
  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Retorna el error 'mismatch' si ambos campos tienen valor y no coinciden
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null; // Si coinciden o uno está vacío, no hay error aquí
  }

  // Alternar visibilidad de contraseña para campos específicos
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword1 = !this.showPassword1;
    } else if (field === 'confirmPassword') {
      this.showPassword2 = !this.showPassword2;
    }
  }

  onSubmit() {
    // Limpiar mensajes y errores previos al intentar un nuevo submit
    this.successMessage = null;
    this.errorMessage = null;
    this.validationErrors = {};

    // Marca todos los controles como tocados para mostrar errores de validación del frontend
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      // Opcional: puedes añadir un mensaje de error general del frontend si lo deseas
      // this.errorMessage = 'Por favor, corrija los errores en el formulario antes de enviar.';
      return; // Detiene la ejecución si el formulario es inválido
    }

    this.isLoading = true; // Activar el estado de carga

    // Mapea los valores del formulario a la estructura que espera tu AuthService y Backend
    const registerData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };

    // Llama al servicio de autenticación para registrar al paciente
    this.authService.registerPaciente(registerData).subscribe({
      next: (response) => {
        // Manejar respuesta exitosa del backend
        this.successMessage = response.message || 'Usuario registrado exitosamente.';
        this.isLoading = false; // Desactivar el spinner una vez que la respuesta llega

        // Opcional: Guardar tokens si el backend los envía, aunque redirijamos al login
        if (response.tokens && response.tokens.access) {
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
            // Nota: Podrías considerar limpiar estos tokens si la intención es
            // que el usuario se loguee manualmente después del registro,
            // ya que al redirigir al login no los usará inmediatamente.
        }

        // Agregamos un pequeño retraso antes de la redirección al login
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirige SIEMPRE al login después del delay
        }, 2000); // Muestra el mensaje de éxito por 2 segundos
      },
      error: (err) => {
        this.isLoading = false; // Desactivar el spinner en caso de error
        this.successMessage = null; // Asegurarse de limpiar cualquier mensaje de éxito anterior

        // Manejo de errores basado en la estructura de la respuesta de error del backend
        if (err.type === 'validation' && err.errors) {
          // Si son errores de validación específicos de campos (ej. 400 Bad Request)
          this.validationErrors = err.errors;
          this.errorMessage = err.message || 'Errores de validación. Por favor, revise el formulario.';
        } else {
          // Otros tipos de errores (ej. error de red, servidor 500, etc.)
          this.errorMessage = err.message || 'Ocurrió un error inesperado. Inténtelo de nuevo.';
        }
      },
      complete: () => {
        // El estado de isLoading ya se maneja en 'next' y 'error',
        // por lo que no es estrictamente necesario aquí a menos que tengas
        // otra lógica que deba ejecutarse al finalizar.
      }
    });
  }

  // Método auxiliar para marcar todos los controles como 'touched'
  // Útil para mostrar todos los errores de validación del frontend al intentar enviar un formulario inválido
  private markAllAsTouched() {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario desde el template
  get nameControl() { return this.registerForm.get('name'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
}