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

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      alert('Ya estás logado');
      this.router.navigate(['/']);
    }
  }

  login() {
    this.authService.login(this.credentials).then(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/']);
      } else {
        alert('Error de inicio de sesión');
      }
    });
  }
}