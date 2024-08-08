import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles']?.map((role: string) => role.toLowerCase());
    const role = this.authService.getRole()?.toLowerCase();

    if (this.authService.isLoggedIn()) {
      if (!expectedRoles || expectedRoles.includes(role)) {
        return true;
      } else {
        console.log(`Rol no autorizado. Se esperaba uno de ${expectedRoles.join(', ')}, pero se obtuvo ${role}`);
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      console.log('No autenticado. Redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
