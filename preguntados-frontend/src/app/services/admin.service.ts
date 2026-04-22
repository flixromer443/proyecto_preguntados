import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Pregunta } from '../models/pregunta';
import { PerfilResponse } from '../models/game.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public apiAdminUrl: string;
  constructor(
    private http: HttpClient
  ) { 
    this.apiAdminUrl = Global.apiAdmin;
  }
  
  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http.post<Pregunta[]>(this.apiAdminUrl, {metodo:"obtenerPreguntas"});
  }

  crearPregunta(payload:any): Observable<Pregunta[]> {
    return this.http.post<Pregunta[]>(this.apiAdminUrl, {metodo:"crearPregunta", payload:payload});
  }

  eliminarPregunta(idPregunta:any): Observable<Pregunta[]> {
    return this.http.post<Pregunta[]>(this.apiAdminUrl, {metodo:"eliminarPregunta", id_pregunta:idPregunta});
  }
}
