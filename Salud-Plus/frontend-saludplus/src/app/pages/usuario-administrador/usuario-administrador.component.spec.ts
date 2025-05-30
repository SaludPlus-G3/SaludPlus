import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAdministradorComponent } from './usuario-administrador.component';

describe('UsuarioAdministradorComponent', () => {
  let component: UsuarioAdministradorComponent;
  let fixture: ComponentFixture<UsuarioAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
