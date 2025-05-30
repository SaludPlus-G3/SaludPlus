import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { UsuarioDoctorComponent } from './pages/usuario-doctor/usuario-doctor.component';
import { UsuarioAdministradorComponent } from './pages/usuario-administrador/usuario-administrador.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path:'paciente', component: PacienteComponent },
  {path: 'usuario-doctor', component:UsuarioDoctorComponent},
  {path:'usuario-administrador', component:UsuarioAdministradorComponent},
  { path: '**', redirectTo: '' },  // ruta comodín para redirigir a home
  
];
