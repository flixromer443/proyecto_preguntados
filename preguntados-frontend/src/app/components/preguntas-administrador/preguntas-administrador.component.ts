import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';
import { Pregunta } from '../../models/pregunta';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-preguntas-administrador',
  templateUrl: './preguntas-administrador.component.html',
  styleUrls: ['./preguntas-administrador.component.css']
})
export class PreguntasAdministradorComponent implements OnInit {

  preguntas: Pregunta[] = [];
  cargando = true;

  itemsPorPagina = 5;
  paginaActual = 1;

  preguntaExpandida: string | null = null;

  mostrarModal = false;

  mostrarConfirmacion = false;
  idPreguntaAEliminar: string | null = null;

  nuevaPregunta = {
    pregunta: '',
    id_tematica: '',
    respuestas: [
      { respuesta: '', correcta: false },
      { respuesta: '', correcta: false },
      { respuesta: '', correcta: false },
      { respuesta: '', correcta: false }
    ]
  };

  tematicas = [
    { id: '1', nombre: 'Historia' },
    { id: '2', nombre: 'Matemática' },
    { id: '3', nombre: 'Deportes' },
    { id: '4', nombre: 'Geografía' },
    { id: '5', nombre: 'Biología' },
    { id: '6', nombre: 'Literatura' }
  ];

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedInAsAdministrador() && !this.authService.isLoggedInAsSuperUsuario()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.cargarPreguntas();
  }

  cargarPreguntas(): void {
    this.cargando = true;

    this.adminService.obtenerPreguntas().subscribe({
      next: (data: Pregunta[]) => {
        this.preguntas = data;
        this.paginaActual = 1;
        this.preguntaExpandida = null;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  togglePregunta(id: string): void {
    this.preguntaExpandida =
      this.preguntaExpandida === id ? null : id;
  }

  get preguntasPaginadas(): Pregunta[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.preguntas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.preguntas.length / this.itemsPorPagina) || 1;
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.preguntaExpandida = null;
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.preguntaExpandida = null;
    }
  }

  seleccionarCorrecta(index: number): void {
    this.nuevaPregunta.respuestas.forEach((r, i) => {
      r.correcta = i === index;
    });
  }

  formularioValido(): boolean {
    if (!this.nuevaPregunta.pregunta.trim()) return false;
    if (!this.nuevaPregunta.id_tematica) return false;

    const respuestasValidas = this.nuevaPregunta.respuestas.filter(r => r.respuesta.trim() !== '');
    if (respuestasValidas.length < 4) return false;

    return this.nuevaPregunta.respuestas.some(r => r.correcta);
  }

  guardarPregunta(): void {

    if (!this.formularioValido()) {
      alert('Completá todos los campos y marcá la respuesta correcta');
      return;
    }

    const payload = {
      pregunta: this.nuevaPregunta.pregunta,
      id_tematica: this.nuevaPregunta.id_tematica,
      respuestas: this.nuevaPregunta.respuestas.map(r => ({
        respuesta: r.respuesta,
        id_estado_respuesta: r.correcta ? '1' : '0'
      }))
    };

    this.adminService.crearPregunta(payload).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarPreguntas();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al guardar');
      }
    });
  }

  abrirConfirmacionEliminar(id: string): void {
    this.idPreguntaAEliminar = id;
    this.mostrarConfirmacion = true;
  }

  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.idPreguntaAEliminar = null;
  }

  eliminarPregunta(): void {
    if (!this.idPreguntaAEliminar) return;

    this.adminService.eliminarPregunta(this.idPreguntaAEliminar).subscribe({
      next: () => {
        this.cerrarConfirmacion();

        if (this.preguntasPaginadas.length === 1 && this.paginaActual > 1) {
          this.paginaActual--;
        }

        this.cargarPreguntas();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al eliminar');
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevaPregunta = {
      pregunta: '',
      id_tematica: '',
      respuestas: [
        { respuesta: '', correcta: false },
        { respuesta: '', correcta: false },
        { respuesta: '', correcta: false },
        { respuesta: '', correcta: false }
      ]
    };
  }

  esCorrecta(idEstado: string): boolean {
    return idEstado === '1';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}