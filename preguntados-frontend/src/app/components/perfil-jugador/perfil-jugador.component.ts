import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';

@Component({
  selector: 'app-perfil-jugador',
  templateUrl: './perfil-jugador.component.html',
  styleUrl: './perfil-jugador.component.css'
})
export class PerfilJugadorComponent {

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);
  }

  // =========================
  // NAVEGACIÓN HOME
  // =========================

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  irEstadisticas() {
    this.router.navigate(['/estadisticas-jugador']);
  }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  irRanking() {
    this.router.navigate(['/ranking']);
  }

  jugar() {
    this.router.navigate(['/jugar']);
  }
  cerrarSesion(){
    
  }
}