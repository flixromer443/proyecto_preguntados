import { Component } from '@angular/core';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { DialogService } from '../../services/dialog.service';

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
    private servicioDialog: DialogService,
    private datosCompartidosService: DatosCompartidosService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);

    // this.cargarEstadisticas();
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

  }
}