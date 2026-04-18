import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresarCorreoComponent } from './ingresar-correo.component';
import { Component } from '@angular/core';




describe('IngresarCodigoComponent', () => {
  let component: IngresarCorreoComponent;
  let fixture: ComponentFixture<IngresarCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngresarCorreoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
