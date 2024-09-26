// src/app/services/clientes.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = `${environment.apiUrl}/clientes`; 

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, cliente);
  }

  actualizarCliente(id_cliente: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_cliente}`, cliente);
  }
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  obtenerEstados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/estados');
  }

  obtenerCondados(codigo_estado: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/condados/${codigo_estado}`);
  }

  obtenerCiudades(codigo_estado: string, codigo_condado: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/ciudades/${codigo_estado}/${codigo_condado}`);
  }
  
}
