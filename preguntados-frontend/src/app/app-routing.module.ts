import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JugarComponent } from './components/jugar/jugar.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { EstadisticasJugadorComponent} from './components/estadisticas-jugador/estadisticas-jugador.component';
import { PerfilJugadorComponent } from './components/perfil-jugador/perfil-jugador.component';
import { IngresarCodigoComponent } from './components/ingresar-codigo/ingresar-codigo.component';
import { IngresarCorreoComponent } from './components/ingresar-correo/ingresar-correo.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { HistorialJugadorComponent } from './components/historial-jugador/historial-jugador.component';
import { RankingJugadorComponent } from './components/ranking-jugador/ranking-jugador.component';

//definir las rutas de la aplicacion
const routes: Routes = [
  {path: 'jugar', component: JugarComponent},
  {path: 'iniciar-sesion', component: IniciarSesionComponent},
  {path: 'registrarse', component: RegistrarseComponent},
  {path: 'estadisticas-jugador', component: EstadisticasJugadorComponent},
  {path: 'ingresar-codigo', component: IngresarCodigoComponent},
  {path: 'ingresar-correo', component: IngresarCorreoComponent},
  {path: 'cambiar-password', component: CambiarPasswordComponent},
  {path: 'perfil-jugador', component: PerfilJugadorComponent},
  {path: 'mi-perfil', component: MiPerfilComponent},
  {path: 'historial-jugador', component: HistorialJugadorComponent},
  {path: 'ranking-jugador', component: RankingJugadorComponent},
  {path: '**', component: IniciarSesionComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
