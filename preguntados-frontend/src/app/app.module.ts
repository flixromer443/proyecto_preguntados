import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// PrimeNG
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { PanelModule } from 'primeng/panel';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PasswordModule } from 'primeng/password'; 

// Servicios
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Componentes
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { JugarComponent } from './components/jugar/jugar.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { EstadisticasJugadorComponent } from './components/estadisticas-jugador/estadisticas-jugador.component';
import { PerfilJugadorComponent } from './components/perfil-jugador/perfil-jugador.component';
import { IngresarCodigoComponent } from './components/ingresar-codigo/ingresar-codigo.component';
import { IngresarCorreoComponent } from './components/ingresar-correo/ingresar-correo.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { AuthInterceptor } from './services/interceptor';
import { HistorialJugadorComponent } from './components/historial-jugador/historial-jugador.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JugarComponent,
    IniciarSesionComponent,
    RegistrarseComponent,
    EstadisticasJugadorComponent,
    PerfilJugadorComponent,
    IngresarCodigoComponent,
    IngresarCorreoComponent,
    CambiarPasswordComponent,
    MiPerfilComponent, 
    HistorialJugadorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // PrimeNG modules
    CalendarModule,
    DialogModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    ToastModule,
    ProgressSpinnerModule,
    StepsModule,
    PanelModule,
    GalleriaModule,
    InputTextModule,
    CardModule,
    AutoCompleteModule,
    PasswordModule
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }