import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingJugadorComponent } from './ranking-jugador.component';

describe('NuestrosServiciosComponent', () => {
  let component: RankingJugadorComponent;
  let fixture: ComponentFixture<RankingJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankingJugadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RankingJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
