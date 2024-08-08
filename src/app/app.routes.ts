import { Routes } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';
import { AuthGuard } from './authguard.service';
import { LoginComponent } from './auth/login/login.component';
import { PrincipalComponent } from './principal/principal.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ChoferesComponent } from './choferes/choferes.component';
import { CamionesComponent } from './camiones/camiones.component';
import { AcopioComponent } from './acopio/acopio.component';

export const routes: Routes = [
    { path: 'usuario' , component: UsuarioComponent, canActivate: [AuthGuard], data:{expectedRoles:['admin'] } },
    { path: 'principal', component: PrincipalComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin'] } },
    { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin','chofer'] } },
    { path: 'chofer', component: ChoferesComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin'] } },
    { path: 'camiones', component: CamionesComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin'] } },
    { path: 'acopio', component: AcopioComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin', 'chofer'] } },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
