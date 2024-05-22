import { Component, OnInit } from '@angular/core';
import { Cliente } from './clientes.interface';
import { ClientesService } from '../clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  mostrarFormulario = false;
  modoEdicion = false;
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  nuevoCliente: Cliente = this.initNuevoCliente();

  constructor(private clientesService: ClientesService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.nuevoCliente = this.initNuevoCliente();
  }

  obtenerClientes() {
    this.clientesService.obtenerClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
      },
      error => {
        console.error('Error al obtener clientes:', error);
      }
    );
  }

  crearCliente() {
    this.clientesService.crearCliente(this.nuevoCliente).subscribe(
      (data: Cliente) => {
        this.clientes.push(data);
        console.log('Cliente creado exitosamente', data);
        this.mostrarFormulario = false;
        this.nuevoCliente = this.initNuevoCliente(); // Reiniciar el objeto nuevoCliente
      },
      error => {
        console.error('Error al crear el cliente:', error);
      }
    );
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = { ...cliente };
    this.nuevoCliente = { ...cliente };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
  }

  actualizarCliente() {
    if (this.clienteSeleccionado) {
      this.clientesService.actualizarCliente(this.clienteSeleccionado.id_cliente, this.nuevoCliente).subscribe(
        (data: Cliente) => {
          const index = this.clientes.findIndex(c => c.id_cliente === this.clienteSeleccionado!.id_cliente);
          this.clientes[index] = data;
          console.log('Cliente actualizado exitosamente', data);
          this.mostrarFormulario = false;
          this.clienteSeleccionado = null;
          this.nuevoCliente = this.initNuevoCliente();
        },
        error => {
          console.error('Error al actualizar el cliente:', error);
        }
      );
    }
  }
  eliminarCliente(id: number) {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este cliente?');
    if (confirmacion) {
      this.clientesService.eliminarCliente(id).subscribe(
        () => {
          this.clientes = this.clientes.filter(c => c.id_cliente !== id);
          console.log('Cliente eliminado exitosamente');
        },
        error => {
          console.error('Error al eliminar el cliente:', error);
        }
      );
    }
  }
  
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.nuevoCliente = this.initNuevoCliente();
  }

  private initNuevoCliente(): Cliente {
    return {
      id_cliente: 0,
      Email: '',
      Nombre: '',
      Dni: '',
      Telefono: '',
      Codigo_postal: '',
      Region: '',
      Direccion: '',
      Nombre_contacto: '',
      Telefono_contacto: '',
      Fecha_ultima_visita: new Date(),
      Intervalo_de_visita: 0,
      Latitud: 0,
      Longitud: 0,
      Fecha_creacion: new Date(),
      Fecha_modificacion: new Date(),
      Estado: 0
    };
  }
}

