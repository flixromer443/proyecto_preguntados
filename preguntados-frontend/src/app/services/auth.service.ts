import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';
import { Global } from './global';
import { Disponibilidad } from '../models/diponibilidad';
import { Pregunta } from '../models/pregunta';
import { LoginResponse, LoginRequest } from '../models/auth.interfaces';
import  jwtDecode  from 'jwt-decode';

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
  
  registrarNuevoUsuario(data: any): Observable<any> {
    return this.http.post<any>(this.apiAuthUrl, data);
  }


  obtenerPreguntasAlAzar(): Observable<Pregunta[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let params = JSON.stringify({'metodo':"obtenerPreguntasAlAzar"});
    return this.http.post<Pregunta[]>(this.apiAuthUrl, params, {headers: headers});
  }

   getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);

      return exp > now;
    } catch (e) {
      return false;
    }
  }

  logout() {
    sessionStorage.clear();
  }

  getUsuario() {
    return JSON.parse(sessionStorage.getItem('usuario') || 'null');
  }

}
