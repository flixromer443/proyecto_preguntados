import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';

interface RankingItem {
  id: number;
  username: string;
  puntaje: number;
  total_aciertos: number;
  total_fallos: number;
  porcentaje_acierto: number;
  posicion: number;
}

@Component({
  selector: 'app-ranking-jugador',
  templateUrl: './ranking-jugador.component.html',
  styleUrls: ['./ranking-jugador.component.css']
})
export class RankingJugadorComponent implements OnInit {

  clasificaciones: RankingItem[] = [];
  posicionUsuario: RankingItem | null = null;
  cargando: boolean = false;

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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.cargarRanking();
  }

  cargarRanking(): void {
    this.cargando = true;

    this.gameService.obtenerRanking().subscribe({
      next: (res: any) => {

        const ranking = res.clasificaciones ?? [];
        const usuario = res.posicion_usuario ?? null;

        this.clasificaciones = ranking.map((r: any) => ({
          id: Number(r.id),
          username: r.username,
          puntaje: Number(r.puntaje),
          total_aciertos: Number(r.total_aciertos),
          total_fallos: Number(r.total_fallos),
          porcentaje_acierto: Number(r.porcentaje_acierto),
          posicion: Number(r.posicion)
        }));

        if (usuario) {
          this.posicionUsuario = {
            id: Number(usuario.id),
            username: usuario.username,
            puntaje: Number(usuario.puntaje),
            total_aciertos: Number(usuario.total_aciertos),
            total_fallos: Number(usuario.total_fallos),
            porcentaje_acierto: Number(usuario.porcentaje_acierto),
            posicion: Number(usuario.posicion)
          };
        } else {
          this.posicionUsuario = null;
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando ranking', err);
        this.cargando = false;
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}