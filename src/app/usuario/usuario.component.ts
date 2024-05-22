import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { Usuario } from './usuario.interface';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = []; 

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
}

