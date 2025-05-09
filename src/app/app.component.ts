import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UsuarioModule } from './usuario/usuario.module';
import { LoginModule } from './auth/login/login.module';
import { AuthService } from './auth.service';
import { ClientesModule } from './clientes/clientes.module';
import { ChoferesModule } from './choferes/choferes.module';
import { CamionesModule } from './camiones/camiones.module';
import { AcopioModule } from './acopio/acopio.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,  RouterOutlet, FormsModule, UsuarioModule, LoginModule, ClientesModule, ChoferesModule, CamionesModule, AcopioModule,MatButtonModule, MatInputModule,MatSelectModule,MatTableModule,
    MatIconModule],
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']     
})
export class AppComponent implements OnInit{
  isAppRoute = false;
  darkMode = false;
  isMobileView = false;
  sidebarExpanded: boolean = true;


  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAppRoute = this.router.url === '/';
      }
    });
  }
  
  ngOnInit(): void {
    this.checkMobileView();
    window.addEventListener('resize', () => {
      this.checkMobileView();
    });
      const darkModeStorage = localStorage.getItem('darkMode');
    if (darkModeStorage === 'enabled') {
      this.enableDarkMode(); 
    }
  }
  
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
      if (this.darkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }
  
  private enableDarkMode(): void {
    document.body.classList.add('dark-mode');
  }
  
  private disableDarkMode(): void {
    document.body.classList.remove('dark-mode');
  }

  toggleSidebarWidth(): void {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
      this.sidebarExpanded = !this.sidebarExpanded;
      
      if (this.sidebarExpanded) {
        sidebar.classList.remove('minimized');
      } else {
        sidebar.classList.add('minimized');
      }
      
      const navLinks = sidebar.getElementsByClassName('nav-link') as HTMLCollectionOf<HTMLElement>;
      const logoutButton = sidebar.getElementsByClassName('logout-button')[0] as HTMLElement;
      
      if (navLinks.length > 0 && logoutButton) {
        if (this.sidebarExpanded) {
          for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].style.display = 'inline-block';
          }
          logoutButton.style.display = 'inline-block';
        } else {
          for (let i = 0; i < navLinks.length; i++) {
            const icon = navLinks[i].getElementsByTagName('i')[0];
            navLinks[i].innerHTML = ''; 
            navLinks[i].appendChild(icon);
            navLinks[i].style.display = 'flex'; 
          }
          logoutButton.style.display = 'inline-block';
        }
      } else {
        console.error('Navigation links or logout button not found');
      }
    } else {
      console.error('Sidebar element not found!');
    }
  }

  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();

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

  navigateToUsuario(): void {
    this.router.navigate(['/usuario']);
  }

  navigateToChofer(): void {
    this.router.navigate(['/chofer']);
  }

  navigateToCamion(): void {
    this.router.navigate(['/camiones']);
  }

  navigateToAcopio(): void {
    this.router.navigate(['/acopio']);
  }

  getUsername() {
    return this.authService.getUsername();  
  }

  getRol(){
    return this.authService.getRole();
  }

}
