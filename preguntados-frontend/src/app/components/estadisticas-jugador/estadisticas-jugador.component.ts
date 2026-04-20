import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';

interface TematicaEstadistica {
  id: number;
  nombre: string;
  porcentaje: number;
  iconClass: string;
}

@Component({
  selector: 'app-estadisticas-jugador',
  templateUrl: './estadisticas-jugador.component.html',
  styleUrl: './estadisticas-jugador.component.css'
})
export class EstadisticasJugadorComponent {
  tematicas: TematicaEstadistica[] = [
    {
      id: 1,
      nombre: 'Historia',
      porcentaje: 0,
      iconClass: 'fa-solid fa-landmark text-body-secondary flex-shrink-0 me-3 fs-4'
    },
    {
      id: 2,
      nombre: 'Matemática',
      porcentaje: 0,
      iconClass: 'fa-solid fa-square-root-variable text-body-secondary flex-shrink-0 me-3 fs-4'
    },
    {
      id: 3,
      nombre: 'Deportes',
      porcentaje: 0,
      iconClass: 'fa-solid fa-futbol text-body-secondary flex-shrink-0 me-3 fs-4'
    },
    {
      id: 4,
      nombre: 'Geografía',
      porcentaje: 0,
      iconClass: 'fa-solid fa-earth-americas text-body-secondary flex-shrink-0 me-3 fs-4'
    },
    {
      id: 5,
      nombre: 'Biología',
      porcentaje: 0,
      iconClass: 'fa-solid fa-dna text-body-secondary flex-shrink-0 me-3 fs-4'
    },
    {
      id: 6,
      nombre: 'Literatura',
      porcentaje: 0,
      iconClass: 'fa-solid fa-book text-body-secondary flex-shrink-0 me-3 fs-4'
    }
  ];

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);

    // this.cargarEstadisticas();
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  /*verTematica(t: TematicaEstadistica) {
    this.servicioDialog.abrirDialog(t); // ahora acepta cualquier objeto
  }*/

  // 💡 futuro: conectar API
  cargarEstadisticas() {
    // ejemplo:
    // this.service.getStats().subscribe(res => {
    //   this.tematicas = res.data;
    // });
  }

  cerrarSesion(){
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}