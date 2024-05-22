// src/app/services/clientes.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'http://localhost:3000/api/clientes';

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
}
