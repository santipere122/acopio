import { Component, OnInit } from '@angular/core';
import { Chofer } from './choferes.interface';
import { ChoferesService } from '../choferes.service';
import { Router } from '@angular/router';
import { CamionesService } from '../camiones.service';

@Component({
  selector: 'app-choferes',
  templateUrl: './choferes.component.html',
  styleUrls: ['./choferes.component.css']
})
export class ChoferesComponent implements OnInit {
  mostrarFormulario = false;
  modoEdicion = false;
  choferes: Chofer[] = [];
  camiones: any[] = [];
  choferSeleccionado: Chofer | null = null;
  nuevoChofer: Chofer = this.initNuevoChofer();

  constructor(private choferesService: ChoferesService,
    private camionesService: CamionesService
    , private router: Router) { }

  ngOnInit(): void {
    this.obtenerChoferes();
    this.cargarCamiones();

  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.nuevoChofer = this.initNuevoChofer();
  }

  obtenerChoferes() {
    this.choferesService.obtenerChoferes().subscribe(
      (data: Chofer[]) => {
        this.choferes = data;
      },
      error => {
        console.error('Error al obtener choferes:', error);
      }
    );
  }

  crearChofer() {
    this.choferesService.crearChofer(this.nuevoChofer).subscribe(
      (data: Chofer) => {
        this.choferes.push(data);
        console.log('Chofer creado exitosamente', data);
        this.mostrarFormulario = false;
        this.nuevoChofer = this.initNuevoChofer();
      },
      error => {
        console.error('Error al crear el chofer:', error);
      }
    );
  }

  seleccionarChofer(chofer: Chofer) {
    this.choferSeleccionado = { ...chofer };
    this.nuevoChofer = { ...chofer };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
  }

  actualizarChofer() {
    if (this.choferSeleccionado) {
      this.choferesService.actualizarChofer(this.choferSeleccionado.id_chofer, this.nuevoChofer).subscribe(
        (data: Chofer) => {
          const index = this.choferes.findIndex(c => c.id_chofer === this.choferSeleccionado!.id_chofer);
          this.choferes[index] = data;
          console.log('Chofer actualizado exitosamente', data);
          this.mostrarFormulario = false;
          this.choferSeleccionado = null;
          this.nuevoChofer = this.initNuevoChofer();
        },
        error => {
          console.error('Error al actualizar el chofer:', error);
        }
      );
    }
  }

  eliminarChofer(id: number) {
    this.choferesService.eliminarChofer(id).subscribe(
      () => {
        this.choferes = this.choferes.filter(c => c.id_chofer !== id);
        console.log('Chofer eliminado exitosamente');
      },
      error => {
        console.error('Error al eliminar el chofer:', error);
      }
    );
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.nuevoChofer = this.initNuevoChofer();
  }

  private initNuevoChofer(): Chofer {
    return {
      id_chofer: 0,
      id_camion: 0,
      Nombre: '',
      Dni: '',
      Region: '',
      Codigo_postal: '',
      Direccion: '',
      Telefono: '',
      Fecha_creacion: new Date(),
      Fecha_modificacion: new Date(),
      Estado: 0
    };
  }
  obtenerIdentificadorCamion(id_camion: number): string {
    const camion = this.camiones.find(c => c.id_camion === id_camion);
    return camion ? camion.Identificador : 'Sin asignar';
  }
  cargarCamiones(): void {
    this.camionesService.obtenerCamiones().subscribe(
      (data) => {
        this.camiones = data;
      },
      (error) => {
        console.error('Error al obtener camiones', error);
      }
    );
  }

}
