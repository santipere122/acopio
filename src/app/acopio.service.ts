import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcopioService {
  private apiUrl = 'http://localhost:3000/api/acopios';

  constructor(private http: HttpClient) {}

  obtenerAcopios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearAcopio(acopio: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, acopio);
  }

  actualizarAcopio(id: number, acopio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, acopio);
  }

  eliminarAcopio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  inicializarAcopios(fecha: string, chofer: number, camion: number) {
    const url = `${this.apiUrl}/inicializar`;
    const body = { fecha, chofer, camion };
    return this.http.post(url, body);
  }
  completarAcopio(id_acopio: number, monto_pagar: string, fecha: string): Observable<any> {
    const url = `${this.apiUrl}/completar`;
    const body = { id_acopio, monto_pagar, fecha };
    return this.http.post<any>(url, body);
  }
}