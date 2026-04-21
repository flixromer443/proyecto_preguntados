import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialJugadorComponent } from './historial-jugador.component';

describe('NuestrosServiciosComponent', () => {
  let component: HistorialJugadorComponent;
  let fixture: ComponentFixture<HistorialJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialJugadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
