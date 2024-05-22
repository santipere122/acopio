import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private username: string | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: { Usuario: string, Password: string }) {
    return this.http.post<any>('http://localhost:3000/api/login', credentials)   
      .toPromise()
      .then(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', credentials.Usuario); 
          this.loggedIn = true;
          this.username = credentials.Usuario; 
          return true;
        } else {
          return false;
        }
      });
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return token != null;
  }
  
  getUsername() {
    if (this.username === null) {
      this.username = localStorage.getItem('username'); 
    }
    return this.username;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedIn = false;
    this.username = null;
  }
}
