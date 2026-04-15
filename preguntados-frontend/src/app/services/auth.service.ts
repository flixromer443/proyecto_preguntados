import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';
import { Global } from './global';
import { Disponibilidad } from '../models/diponibilidad';
import { Pregunta } from '../models/pregunta';
import { LoginResponse, LoginRequest } from '../models/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public url: string;
  public apiAuthUrl: string;
  constructor(
    private http: HttpClient
  ) { 
    this.url = Global.url;
    this.apiAuthUrl = Global.apiAuth;
  }

  iniciarSesion(username: string, contrasenia: string): Observable<LoginResponse> {
    const body: LoginRequest = {
      metodo: "iniciarSesion",
      credenciales: { username, contrasenia}
    };
    return this.http.post<LoginResponse>(this.apiAuthUrl, body);
  }
  
  obtenerPreguntasAlAzar(): Observable<Pregunta[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let params = JSON.stringify({'metodo':"obtenerPreguntasAlAzar"});
    return this.http.post<Pregunta[]>(this.apiAuthUrl, params, {headers: headers});
  }

}
