import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilSuperUsuarioComponent } from './perfil-super-usuario.component';

describe('PerfilAdministradorComponent', () => {
  let component: PerfilSuperUsuarioComponent;
  let fixture: ComponentFixture<PerfilSuperUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilSuperUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilSuperUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
