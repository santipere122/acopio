import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Usuario } from '../app/usuario/usuario.interface'; 


@Injectable({
  providedIn: 'root',

})
export class UsuarioService {

  constructor(private http: HttpClient) { }
  private API_URL = `${environment.apiUrl}/usuarios`; 
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.API_URL}/editar/${usuario.id_Usuario}`, usuario);
  }

  crearUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.API_URL}/crear`, datos);
  }
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/eliminar/${id}`);
}
verificarUsuarioExistente(nombreUsuario: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.API_URL}/verificar/${nombreUsuario}`);
}
verificarChoferAsignado(id_chofer: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.API_URL}/verificar-chofer/${id_chofer}`);
}
}
