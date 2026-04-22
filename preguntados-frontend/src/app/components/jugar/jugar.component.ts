import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Pregunta, Respuesta } from '../../models/pregunta';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-jugar',
  templateUrl: './jugar.component.html',
  styleUrl: './jugar.component.css'
})
export class JugarComponent {

  html: string = '';
  cargando = true;
  cargando2 = false;

  mostrarPreguntas = false;
  preguntas: Pregunta[] = [];
  indiceActual = 0;
  respondido = false;
  respuestaSeleccionada: Respuesta | null = null;
  aciertos = 0;
  fallos = 0;
  juegoTerminado = false;
  mostrarModalFin = false;

  estadisticasTematicas: any = {
    "1": { nombre: "Historia", aciertos: 0, fallos: 0 },
    "2": { nombre: "Matemáticas", aciertos: 0, fallos: 0 },
    "3": { nombre: "Deportes", aciertos: 0, fallos: 0 },
    "4": { nombre: "Geografía", aciertos: 0, fallos: 0 },
    "5": { nombre: "Biología", aciertos: 0, fallos: 0 },
    "6": { nombre: "Literatura", aciertos: 0, fallos: 0 }
  };

  tematicas: any = {
    "1": { nombre: "Historia", color: "bg-danger" },
    "2": { nombre: "Matemáticas", color: "bg-primary" },
    "3": { nombre: "Deportes", color: "bg-success" },
    "4": { nombre: "Geografía", color: "bg-warning" },
    "5": { nombre: "Biología", color: "bg-info" },
    "6": { nombre: "Literatura", color: "bg-dark" }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService,
    private gameService: GameService,
  ) {
    this.datosCompartidosService.esconderBuscador.next(true);
    this.datosCompartidosService.esconderFooter.next(true);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedInAsJugador()) {
      this.router.navigate(['/iniciar-sesion']);
    }else{
      setTimeout(() => {
        this.cargando = false;
        this.datosCompartidosService.esconderFooter.next(false);
      }, 500);
    
      this.gameService.obtenerPreguntasAlAzar().subscribe((data: Pregunta[]) => {
        this.preguntas = data;
      });
    }
  }

  get preguntaActual(): Pregunta | null {
    return this.preguntas[this.indiceActual] || null;
  }

  get tematicaActual() {
    if (!this.preguntaActual) return null;
    return this.tematicas[this.preguntaActual.id_tematica];
  }

  seleccionarRespuesta(r: Respuesta) {

    this.respuestaSeleccionada = r;
    this.respondido = true;

    const idTematica = this.preguntaActual?.id_tematica;

    if (r.id_estado_respuesta === "1") {

      this.aciertos++;

      if (idTematica && this.estadisticasTematicas[idTematica]) {
        this.estadisticasTematicas[idTematica].aciertos++;
      }

    }
    else {

      this.fallos++;

      if (idTematica && this.estadisticasTematicas[idTematica]) {
        this.estadisticasTematicas[idTematica].fallos++;
      }
    }
  }

  getClaseRespuesta(r: Respuesta): string {

    if (!this.respondido) {
      return 'btn-outline-primary';
    }

    if (r.id_estado_respuesta === "1") {
      return 'btn-success';
    }

    if (r === this.respuestaSeleccionada) {
      return 'btn-danger';
    }

    return 'btn-outline-secondary';
  }

  siguientePregunta() {

    if (this.indiceActual < this.preguntas.length - 1) {

      this.indiceActual++;
      this.respondido = false;
      this.respuestaSeleccionada = null;

    } else {

      this.juegoTerminado = true;

      // opcional: log final
      console.log('RESULTADO FINAL:', {
        aciertos: this.aciertos,
        fallos: this.fallos,
        porTematica: this.estadisticasTematicas
      });
    }
  }

  reiniciarJuego() {

    this.indiceActual = 0;
    this.aciertos = 0;
    this.fallos = 0;
    this.juegoTerminado = false;
    this.respondido = false;
    this.respuestaSeleccionada = null;

    // reset estadísticas por temática
    Object.keys(this.estadisticasTematicas).forEach(key => {
      this.estadisticasTematicas[key].aciertos = 0;
      this.estadisticasTematicas[key].fallos = 0;
    });
  }


  abrirModalFinalizar() {
    this.mostrarModalFin = true;
  }

  finalizarJuego() {

    const payload ={
      "aciertos":this.aciertos,
      "fallos":this.fallos,
      "estadisticas":this.estadisticasTematicas
    }

    this.mostrarModalFin = false;
    this.juegoTerminado = true;

    this.gameService.guardarResultados(payload).subscribe({
      next: (response: any) => {
        this.cargando = false;
        this.router.navigate(['/perfil-jugador']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.log(err)
      }
    });
  }
}