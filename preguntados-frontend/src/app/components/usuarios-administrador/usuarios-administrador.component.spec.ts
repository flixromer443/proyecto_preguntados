import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasAdministradorComponent } from './preguntas-administrador.component';

describe('PreguntasAdministradorComponent', () => {
  let component: PreguntasAdministradorComponent;
  let fixture: ComponentFixture<PreguntasAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreguntasAdministradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreguntasAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
