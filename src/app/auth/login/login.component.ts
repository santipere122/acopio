import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { Usuario: '', Password: '' };
  errorMessage: string | null = null;
  passwordFieldType: string = 'password'; 


  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectUser();
    }
  }

  login() {
    this.authService.login(this.credentials)
      .then(result => {
        if (result && result.success) {
          this.redirectUser();
        } else {
          this.errorMessage = result?.message || 'Usuario o contraseña incorrectos';
        }
      })
      .catch(error => {
        console.error('Error en el inicio de sesión:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      });
  }
  
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  
  private redirectUser() {
    const role = this.authService.getRole()?.toLowerCase();
    if (role === 'admin') {
      this.router.navigate(['/']);
    } else if (role === 'chofer') {
      this.router.navigate(['/acopio']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

