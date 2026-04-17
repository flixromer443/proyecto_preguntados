import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import {
  ProvinciasResponse,
  DepartamentosResponse,
  LocalidadesResponse
} from '../models/georef.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeorefService {

  public url: string;
  public georefUrl: string = '';

  constructor(
    private http: HttpClient
  ) { 
    this.url = Global.url;
    this.georefUrl = Global.apiGeoref;
  }

  getProvincias(): Observable<ProvinciasResponse> {
    const params = new HttpParams()
      .set('orden', 'nombre');

    return this.http.get<ProvinciasResponse>(
      `${this.georefUrl}/provincias`,
      { params }
    );
  }

  getDepartamentosPorProvincia(idProvincia: string): Observable<DepartamentosResponse> {
    const params = new HttpParams()
      .set('provincia', idProvincia)
      .set('max', '5000')
      .set('orden', 'nombre');

    return this.http.get<DepartamentosResponse>(
      `${this.georefUrl}/departamentos`,
      { params }
    );
  }

  getLocalidades(idProvincia: string, idDepartamento: string): Observable<LocalidadesResponse> {
    const params = new HttpParams()
      .set('provincia', idProvincia)
      .set('departamento', idDepartamento)
      .set('max', '5000')
      .set('orden', 'nombre');

    return this.http.get<LocalidadesResponse>(
      `${this.georefUrl}/localidades`,
      { params }
    );
  }

  buscarLocalidades(nombre: string): Observable<LocalidadesResponse> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('max', '20');

    return this.http.get<LocalidadesResponse>(
      `${this.georefUrl}/localidades`,
      { params }
    );
  }

  getProvinciaPorNombre(nombre: string): Observable<ProvinciasResponse> {
    const params = new HttpParams()
      .set('nombre', nombre);

    return this.http.get<ProvinciasResponse>(
      `${this.georefUrl}/provincias`,
      { params }
    );
  }
}