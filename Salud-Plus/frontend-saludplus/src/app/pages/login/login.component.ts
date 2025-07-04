import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';

// Importa tu AuthService y la interfaz LoginResponse
import { AuthService, LoginResponse } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Indica que es un componente standalone
  imports: [
    ReactiveFormsModule, // Para usar formularios reactivos
    RouterLink,          // Para el enlace "Crear cuenta"
    NgClass,             // Para aplicar clases condicionales (ej. [class.invalid])
    NgIf,                // Para mostrar/ocultar elementos condicionalmente (ej. mensajes de error, spinner)
    CommonModule         // Necesario para directivas estructurales como *ngIf
  ],
  templateUrl: './login.component.html', // Ruta al archivo HTML del componente
  styleUrl: './login.component.css'      // Ruta al archivo CSS del componente
})
export class LoginComponent {
  loginForm: FormGroup; // Define el formulario de login como un FormGroup
  showPassword = false; // Controla la visibilidad de la contraseña (mostrar/ocultar)
  isLoading: boolean = false; // Indica si hay una operación de login en curso (para mostrar un spinner)
  errorMessage: string | null = null; // Almacena mensajes de error para mostrar al usuario

  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder para construir el formulario
    private router: Router, // Inyecta Router para la navegación entre rutas
    private authService: AuthService // Inyecta tu AuthService para la comunicación con el backend
  ) {
    // Inicializa el formulario de login con sus controles y validadores
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo email: obligatorio y formato de email válido
      password: ['', Validators.required]                     // Campo password: obligatorio
    });
  }

  /**
   * Alterna la visibilidad del campo de contraseña.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Maneja el envío del formulario de login.
   */
  onSubmit() {
    this.errorMessage = null; // Limpia cualquier mensaje de error previo al intentar un nuevo submit

    // Si el formulario no es válido (según las validaciones del frontend)
    if (this.loginForm.invalid) {
      // Marca todos los controles del formulario como 'touched' para mostrar los mensajes de error de validación
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return; // Detiene la ejecución del método
    }

    this.isLoading = true; // Activa el spinner para indicar que la operación está en curso

    // Obtiene los valores de email y password del formulario
    const { email, password } = this.loginForm.value;

    // Llama al método loginPaciente del AuthService para enviar las credenciales al backend
    this.authService.loginPaciente({ email, password }).subscribe({
      // Callback para una respuesta exitosa del backend
      next: (response: LoginResponse) => { // 'response' está tipado como LoginResponse
        this.isLoading = false; // Desactiva el spinner

        // Lógica de redirección basada en el rol del usuario
        // La propiedad 'is_doctor' debe ser enviada por tu CustomTokenObtainPairSerializer de Django
        if (response.is_doctor) {
          this.router.navigate(['/usuario-doctor']); // Redirige a la interfaz del doctor
        } else {
          this.router.navigate(['/paciente']); // Redirige a la interfaz del paciente
        }
      },
      // Callback para manejar errores del backend o de la red
      error: (err: any) => { // 'err' es el objeto de error personalizado que devuelve handleError del AuthService
        this.isLoading = false; // Desactiva el spinner
        // Muestra el mensaje de error al usuario, usando el mensaje del backend o uno genérico
        this.errorMessage = err.message || 'Error de inicio de sesión. Verifique sus credenciales.';
        console.error('Error durante el login:', err); // Log del error completo para depuración
      },
      // Callback que se ejecuta cuando el Observable se completa (ya sea por éxito o error)
      complete: () => {
        this.isLoading = false; // Asegura que el spinner se desactive al finalizar
      }
    });
  }

  // Getters para acceder fácilmente a los controles del formulario desde el template HTML
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }
}
