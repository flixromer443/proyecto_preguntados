import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-super-usuario-administrador',
  templateUrl: './perfil-super-usuario.component.html',
  styleUrls: ['./perfil-super-usuario.component.css']
})
export class PerfilSuperUsuarioComponent implements OnInit {

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService
  ) {
    // UI global
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedInAsSuperUsuario()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }
  }

  ingresarComoJugador(): void {
    this.router.navigate(['/perfil-jugador']);
  }

  ingresarComoAdministrador(): void {
    this.router.navigate(['/perfil-administrador']);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}