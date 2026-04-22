import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-administrador',
  templateUrl: './perfil-administrador.component.html',
  styleUrls: ['./perfil-administrador.component.css']
})
export class PerfilAdministradorComponent implements OnInit {

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
    if (!this.authService.isLoggedInAsAdministrador()  && !this.authService.isLoggedInAsSuperUsuario()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }
  }

  irPreguntas(): void {
    this.router.navigate(['/preguntas-administrador']);
  }

  irUsuarios(): void {
    this.router.navigate(['/usuarios-administrador']);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}