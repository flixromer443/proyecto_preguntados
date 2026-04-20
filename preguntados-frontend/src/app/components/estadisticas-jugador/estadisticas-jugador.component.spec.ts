import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasJugadorComponent } from './estadisticas-jugador.component';

describe('NuestrosServiciosComponent', () => {
  let component: EstadisticasJugadorComponent;
  let fixture: ComponentFixture<EstadisticasJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadisticasJugadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadisticasJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
