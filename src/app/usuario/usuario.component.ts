import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioCreacion } from './usuario.interface';
import { ChoferesService } from '../choferes.service';
import { Chofer } from '../choferes/choferes.interface';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  choferes: Chofer[] = [];
  nuevoUsuario: UsuarioCreacion = { Usuario: '', Password: '', Rol: 'Admin', id_chofer: null };
  confirmarPassword: string = '';
  usuarioEditar: Usuario = { id_Usuario: 0, Usuario: '', Password: '', Fecha_Creacion: '', Fecha_Modificacion: '', Estado: '', id_chofer: null, Rol: '' };
  confirmarPasswordEditar: string = '';
  mostrarPassword: boolean = false;
  displayedColumns: string[] = ['Usuario', 'Rol', 'Acciones'];
  mostrarCrearUsuario = false;
  mostrarEditarUsuario = false;
  usuarioSeleccionado: number | undefined;

  constructor(
    private usuarioService: UsuarioService,
    private choferService: ChoferesService
  ) {
    
   }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );

    this.choferService.obtenerChoferes().subscribe(
      (data: Chofer[]) => {
        this.choferes = data;
      },
      error => {
        console.error('Error al obtener choferes:', error);
      }
    );
  }

  mostrarFormularioCrear() {
    this.mostrarCrearUsuario = true;
    this.mostrarEditarUsuario = false;
  }

  mostrarFormularioEditar() {
    this.mostrarCrearUsuario = false;
    this.mostrarEditarUsuario = true;
  }

  cancelar() {
    this.limpiarFormulario();
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
  this.nuevoUsuario = { Usuario: '', Password: '', Rol: 'Admin', id_chofer: null };
  this.confirmarPassword = '';
  this.usuarioEditar = { id_Usuario: 0, Usuario: '', Password: '', Fecha_Creacion: '', Fecha_Modificacion: '', Estado: '', id_chofer: null, Rol: '' };
  this.confirmarPasswordEditar = '';
  this.mostrarCrearUsuario = false;
  this.mostrarEditarUsuario = false;
  this.usuarioSeleccionado = undefined;
}

  toggleMostrarPassword(event: Event) {
    event.stopPropagation(); // Asegúrate de detener la propagación
    this.mostrarPassword = !this.mostrarPassword;
}

  cargarDatosUsuario() {
    if (this.usuarioSeleccionado) {
      const idSeleccionado = +this.usuarioSeleccionado; // Convierte a número
      const usuario = this.usuarios.find(u => u.id_Usuario === idSeleccionado);
      if (usuario) {
        this.usuarioEditar = { ...usuario };
        this.confirmarPasswordEditar = usuario.Password; // Cargar la contraseña actual
      } else {
        console.error('Usuario no encontrado');
      }
    } else {
      console.error('No se ha seleccionado un usuario');
    }
  }

  crearUsuario() {
    if (this.nuevoUsuario.Password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    const nombreUsuarioLower = this.nuevoUsuario.Usuario.toLowerCase();
  
    this.usuarioService.verificarUsuarioExistente(nombreUsuarioLower).subscribe(
      (respuesta: any) => {
        if (respuesta.existe) {
          alert('El usuario ya existe. Por favor, elige otro nombre de usuario.');
        } else {
          // Verificar si el chofer ya está asignado
          if (this.nuevoUsuario.id_chofer) {
            this.usuarioService.verificarChoferAsignado(this.nuevoUsuario.id_chofer).subscribe(
              (existe: boolean) => {
                if (existe) {
                  alert('El chofer ya está asignado a otro usuario.');
                } else {
                  // Si el chofer no está asignado, proceder a crear el usuario
                  this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(
                    () => {
                      console.log('Usuario creado con éxito');
                      this.ngOnInit(); // Recargar la lista de usuarios
                      this.limpiarFormulario(); // Limpiar el formulario
                    },
                    error => {
                      console.error('Error al crear usuario:', error);
                    }
                  );
                }
              },
              error => {
                console.error('Error al verificar chofer:', error);
              }
            );
          } else {
            // Si no hay chofer, proceder a crear el usuario
            this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(
              () => {
                console.log('Usuario creado con éxito');
                this.ngOnInit(); // Recargar la lista de usuarios
                this.limpiarFormulario(); // Limpiar el formulario
              },
              error => {
                console.error('Error al crear usuario:', error);
              }
            );
          }
        }
      },
      error => {
        console.error('Error al verificar usuario:', error);
      }
    );
  }
  
  editarUsuario() {
    if (this.usuarioEditar.Password !== this.confirmarPasswordEditar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.usuarioEditar.Rol = this.usuarioEditar.id_chofer ? 'Chofer' : 'Admin';
    
    this.usuarioService.actualizarUsuario(this.usuarioEditar).subscribe(
      () => {
        console.log('Usuario actualizado con éxito');
        this.ngOnInit(); // Recargar la lista de usuarios
        this.limpiarFormulario(); // Limpiar el formulario
      },
      error => {
        console.error('Error al actualizar usuario:', error);
      }
    );
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        this.usuarioService.eliminarUsuario(id).subscribe(
            () => {
                console.log('Usuario eliminado con éxito');
                this.ngOnInit(); // Recargar la lista de usuarios
            },
            error => {
                console.error('Error al eliminar usuario:', error);
            }
        );
    }
}

onRolChange() {
  if (this.nuevoUsuario.Rol === 'Admin') {
      this.nuevoUsuario.id_chofer = null; // Si es Admin, no necesita un chofer
  }
}

}
