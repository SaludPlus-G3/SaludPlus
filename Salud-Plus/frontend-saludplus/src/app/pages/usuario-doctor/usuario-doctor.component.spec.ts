import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioDoctorComponent } from './usuario-doctor.component';
import { RouterLink } from '@angular/router';
import { HeaderUsuarioComponent } from '../../shared/header-usuario/header-usuario.component';

describe('UsuarioDoctorComponent', () => {
  let component: UsuarioDoctorComponent;
  let fixture: ComponentFixture<UsuarioDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
