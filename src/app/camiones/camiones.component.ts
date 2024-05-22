import { Component, OnInit } from '@angular/core';
import { Camion } from './camiones.interface';
import { CamionesService } from '../camiones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.component.html',
  styleUrls: ['./camiones.component.css']
})
export class CamionesComponent implements OnInit {
  mostrarFormulario = false;
  modoEdicion = false;
  camiones: Camion[] = [];
  camionSeleccionado: Camion | null = null;
  nuevoCamion: Camion = this.initNuevoCamion();

  constructor(private camionesService: CamionesService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerCamiones();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.nuevoCamion = this.initNuevoCamion();
  }

  obtenerCamiones() {
    this.camionesService.obtenerCamiones().subscribe(
      (data: Camion[]) => {
        this.camiones = data;
      },
      error => {
        console.error('Error al obtener camiones:', error);
      }
    );
  }

  crearCamion() {
    this.camionesService.crearCamion(this.nuevoCamion).subscribe(
      (data: Camion) => {
        this.camiones.push(data);
        console.log('Camión creado exitosamente', data);
        this.mostrarFormulario = false;
        this.nuevoCamion = this.initNuevoCamion();
      },
      error => {
        console.error('Error al crear el camión:', error);
      }
    );
  }

  seleccionarCamion(camion: Camion) {
    this.camionSeleccionado = { ...camion };
    this.nuevoCamion = { ...camion };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
  }

  actualizarCamion() {
    if (this.camionSeleccionado) {
      this.camionesService.actualizarCamion(this.camionSeleccionado.id_camion, this.nuevoCamion).subscribe(
        (data: Camion) => {
          const index = this.camiones.findIndex(c => c.id_camion === this.camionSeleccionado!.id_camion);
          this.camiones[index] = data;
          console.log('Camión actualizado exitosamente', data);
          this.mostrarFormulario = false;
          this.camionSeleccionado = null;
          this.nuevoCamion = this.initNuevoCamion();
        },
        error => {
          console.error('Error al actualizar el camión:', error);
        }
      );
    }
  }

  eliminarCamion(id: number) {
    this.camionesService.eliminarCamion(id).subscribe(
      () => {
        this.camiones = this.camiones.filter(c => c.id_camion !== id);
        console.log('Camión eliminado exitosamente');
      },
      error => {
        console.error('Error al eliminar el camión:', error);
      }
    );
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.nuevoCamion = this.initNuevoCamion();
  }

  private initNuevoCamion(): Camion {
    return {
      id_camion: 0,
      Identificador: '',
      Matricula: '',
      Marca: '',
      Modelo: '',
      Fecha_creacion: new Date(),
      Fecha_modificacion: new Date(),
    };
  }
}
