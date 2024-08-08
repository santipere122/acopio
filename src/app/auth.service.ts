import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse  } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private username: string | null = null;
  private role: string | null = null;
  private id_chofer: string | null = null;
  private id_camion: string | null = null; 
  private fechaActual: string | null = null;  


  constructor(private http: HttpClient) {}

  login(credentials: { Usuario: string, Password: string }) {
    return this.http.post<any>('http://localhost:3000/api/login', credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', payload.username);
            localStorage.setItem('role', payload.role.toLowerCase());
            localStorage.setItem('id_chofer', payload.id_chofer);
            localStorage.setItem('id_camion', payload.id_camion);
            localStorage.setItem('fechaActual', response.fechaActual);  
            this.loggedIn = true;
            this.username = payload.username;
            this.role = payload.role.toLowerCase();
            this.fechaActual = response.fechaActual;
            return { success: true };
          } else {
            return { success: false, message: 'Error desconocido' };
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      ).toPromise();
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }
  
  getUsername() {
    if (!this.username) {
      this.username = localStorage.getItem('username'); 
    }
    return this.username;
  }

  getRole() {
    if (!this.role) {
      this.role = localStorage.getItem('role'); 
    }
    return this.role;
  }
  getIdChofer(){
    if(!this.id_chofer){
      this.id_chofer = localStorage.getItem('id_chofer')
    }
    return this.id_chofer;
  }

  getIdCamion(){
    if(!this.id_camion){
      this.id_camion = localStorage.getItem('id_camion');
    }
    return this.id_camion;
  }
  

  getFechaActual() {
    if (!this.fechaActual) {
      this.fechaActual = localStorage.getItem('fechaActual');
    }
    return this.fechaActual;
  }

  isAdmin() {
    return this.getRole() === 'admin';
  }

  isChofer(){
    return this.getRole() === 'chofer';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id_chofer');
    localStorage.removeItem('id_camion');
    localStorage.removeItem('FechaActual');
    this.loggedIn = false;
    this.username = null;
    this.role = null;
  }

}
