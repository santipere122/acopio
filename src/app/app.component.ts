import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UsuarioModule } from './usuario/usuario.module';
import { LoginModule } from './auth/login/login.module';
import { AuthService } from './auth.service';
import { ClientesModule } from './clientes/clientes.module';
import { ChoferesModule } from './choferes/choferes.module';
import { CamionesModule } from './camiones/camiones.module';
import { AcopioModule } from './acopio/acopio.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, UsuarioModule, LoginModule,FormsModule,ClientesModule,ChoferesModule,CamionesModule,AcopioModule], 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']     
})

export class AppComponent {
  isAppRoute = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAppRoute = this.router.url === '/';
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToClientes(): void {
    this.router.navigate(['/clientes']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  navigateToUsuario():void{
    this.router.navigate(['/usuario']);
  }

  navigateToChofer():void{
    this.router.navigate(['/chofer']);
  }

  navigateToCamion():void{
    this.router.navigate(['/camiones']);
  }
  
  navigateToAcopio():void{
    this.router.navigate(['/acopio'])
  }

  getUsername() {
    return this.authService.getUsername();
  }
}
