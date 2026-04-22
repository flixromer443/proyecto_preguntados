import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';

interface Partida {
  fecha: Date;
  aciertos: number;
  fallos: number;
  porcentaje: number;
}

@Component({
  selector: 'app-historial-jugador',
  templateUrl: './historial-jugador.component.html',
  styleUrls: ['./historial-jugador.component.css']
})
export class HistorialJugadorComponent implements OnInit {

  historialPartidas: Partida[] = [];
  cargando: boolean = false;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService,
    private gameService: GameService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedInAsJugador()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;

    this.gameService.obtenerHistorial().subscribe({
      next: (res: any) => {

        const partidas = res.partidas ?? [];

        this.historialPartidas = partidas.map((p: any) => {

          const aciertos = Number(p.aciertos) || 0;
          const fallos = Number(p.fallos) || 0;
          const total = aciertos + fallos;

          return {
            fecha: new Date(p.fecha_y_hora?.replace(' ', 'T')),
            aciertos,
            fallos,
            porcentaje: total > 0
              ? Number(((aciertos / total) * 100).toFixed(2))
              : 0
          };
        });

        
        this.historialPartidas.sort(
          (a, b) => b.fecha.getTime() - a.fecha.getTime()
        );

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.cargando = false;
      }
    });
  }

  get partidasPaginadas(): Partida[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.historialPartidas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.historialPartidas.length / this.itemsPorPagina);
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

 paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}