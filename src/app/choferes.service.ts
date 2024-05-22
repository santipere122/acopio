import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoferesService {
  private API_URL = 'http://localhost:3000/api/choferes';

  constructor(private http: HttpClient) { }

  obtenerChoferes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  crearChofer(chofer: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/crear`, chofer);
  }

  actualizarChofer(id: number, chofer: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, chofer);
  }

  eliminarChofer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
