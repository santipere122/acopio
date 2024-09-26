import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) {}

  getEstados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/estados`);
  }

  getCondados(estado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/condados/${estado}`);
  }

  getCiudades(estado: string, condado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ciudades/${estado}/${condado}`);
  }

  getCodigosPostales(term: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/codigos-postales?search=${term}`);
  }

  getCoordenadasPorCodigoPostal(codigo_postal: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/coordenadas/${codigo_postal}`);
  }
}
