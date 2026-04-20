import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatosCompartidosService } from './services/datos-compartidos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Preguntados';

  esconderBuscador = false;

  esconderFooter = false;
  
  constructor(private router: Router, 
    private titleService: Title, 
    public datosCompartidosService: DatosCompartidosService
    ) {

      this.datosCompartidosService.esconderBuscador.subscribe(
        esconderBuscador => {
          this.esconderBuscador = esconderBuscador;
        }
      );

      this.datosCompartidosService.esconderFooter.subscribe(
        esconderFooter => {
          this.esconderFooter = esconderFooter;
        }
      );

  }

  ngOnInit() {
    //this.router.navigate(['/']);
    this.titleService.setTitle('PREGUNTADØS');
    //this.datos.pagoCompletado = false;
  }
}
