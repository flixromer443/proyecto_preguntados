import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';
import { Global } from './global';
import { Disponibilidad } from '../models/diponibilidad';
import { Pregunta } from '../models/pregunta';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public url: string;
  public apiGameUrl: string;
  constructor(
    private http: HttpClient
  ) { 
    this.url = Global.url;
    this.apiGameUrl = Global.apiGame;
  }

  obtenerPreguntaAlAzar(): Observable<string> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let params = JSON.stringify({'metodo':"obtenerPreguntaAlAzar"});
    return this.http.post<string>(this.apiGameUrl, params, {headers: headers});
  }
  
  obtenerPreguntasAlAzar(): Observable<Pregunta[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let params = JSON.stringify({'metodo':"obtenerPreguntasAlAzar"});
    return this.http.post<Pregunta[]>(this.apiGameUrl, params, {headers: headers});
  }

}
