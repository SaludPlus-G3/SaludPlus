import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass,NgIf } from '@angular/common';
import { toNamespacedPath } from 'node:path';
//import { Router } from 'express';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  UsuariosDisponibles: {tipoUsuario: String,email:string,password:string} []=[{tipoUsuario:"Doctor", email:"luismendez@redsalud.cl", password:"Tomas"},{tipoUsuario:"Administrador",email:"Administrador@redsalud.cl",password:"Tomas2001" },{tipoUsuario:"Paciente",email:"JuanPerez@gmail.cl",password:"Juan123"}];
  

  constructor(private fb: FormBuilder, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
   
  onSubmit() {
    if (this.loginForm.valid) {
    const {email, password}= this.loginForm.value
    const usuario = this.UsuariosDisponibles.find(u=>u.email ==email && u.password == password);
      if(usuario){
        switch(usuario.tipoUsuario){
          case "Doctor":
            this.router.navigate(['/usuario-doctor']);
            break;
            case "Administrador":
            this.router.navigate(['/usuario-administrador']);
            break;
            case "Paciente":
              this.router.navigate(['/paciente'])
      }
      alert('Login exitoso');
    }
    else{ 
      alert("Usuario o contraseña Incorrectos")
    }
  }
  }
}
