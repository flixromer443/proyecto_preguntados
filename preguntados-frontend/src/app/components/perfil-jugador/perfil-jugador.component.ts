import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-jugador',
  templateUrl: './perfil-jugador.component.html',
  styleUrl: './perfil-jugador.component.css'
})
export class PerfilJugadorComponent {

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);
  }

  ngOnInit() {
    if (!this.authService.isLoggedInAsJugador() && !this.authService.isLoggedInAsSuperUsuario()) {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  irPerfil() {
    this.router.navigate(['/mi-perfil']);
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
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}