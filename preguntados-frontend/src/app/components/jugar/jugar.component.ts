import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Pregunta, Respuesta } from '../../models/pregunta';

@Component({
  selector: 'app-jugar',
  templateUrl: './jugar.component.html',
  styleUrl: './jugar.component.css'
})
export class JugarComponent {
  html: string = ''; 
  cargando = true;//Para mostrar el spinner de cargando cuando inicializa el componente
  cargando2 = false;//Para mostrar el spinner de cargando cuando se busca la reserva
  
  mostrarPreguntas = false;
  preguntas: Pregunta[] = [];
  indiceActual = 0;
  respondido = false;
  respuestaSeleccionada: Respuesta | null = null;
  aciertos = 0;
  fallos = 0;
  juegoTerminado = false;

  tematicas: any = {
    "1": { nombre: "Historia", color: "bg-danger" },
    "2": { nombre: "Matemáticas", color: "bg-primary" },
    "3": { nombre: "Deportes", color: "bg-success" },
    "4": { nombre: "Geografía", color: "bg-warning" },
    "5": { nombre: "Biología", color: "bg-info" },
    "6": { nombre: "Literatura", color: "bg-dark" }
  };


  constructor(
    private fb: FormBuilder,//Formulario reactivo
    private datosCompartidosService: DatosCompartidosService,//Servicio para compartir datos entre componentes
    private gameService: GameService,
    ) {
      this.datosCompartidosService.esconderBuscador.next(true);
      this.datosCompartidosService.esconderFooter.next(true);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargando = false;
      this.datosCompartidosService.esconderFooter.next(false);
     }, 500);

    this.gameService.obtenerPreguntasAlAzar().subscribe((data: Pregunta[]) => {
      this.preguntas = data;
    });
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

    if (r.id_estado_respuesta === "1") {
      this.aciertos++;
    } else {
      this.fallos++;
    }
  }

  getClaseRespuesta(r: Respuesta): string {

    if (!this.respondido) {
      return 'btn-outline-primary';
    }

    // Respuesta correcta
    if (r.id_estado_respuesta === "1") {
      return 'btn-success';
    }

    // Respuesta incorrecta seleccionada
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
    }
  }
  
  reiniciarJuego() {
    this.indiceActual = 0;
    this.aciertos = 0;
    this.fallos = 0;
    this.juegoTerminado = false;
    this.respondido = false;
    this.respuestaSeleccionada = null;
  }

}
