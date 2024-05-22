import { Component, OnInit } from '@angular/core';
import { AcopioService } from '../acopio.service';
import { ClientesService } from '../clientes.service';
import { ChoferesService } from '../choferes.service';
import { CamionesComponent } from '../camiones/camiones.component';
import { CamionesService } from '../camiones.service';

@Component({
  selector: 'app-acopio',
  templateUrl: './acopio.component.html',
  styleUrls: ['./acopio.component.css']
})
export class AcopioComponent implements OnInit {
  acopios: any[] = [];
  clientes: any[] = []; 
  choferes:any[] = [] ;
  camiones:any[]=[];
  nuevoAcopio: any = this.inicializarAcopio();
  mostrarFormulario = false;
  modoEdicion = false;
  acopioSeleccionado: any = null;
  

  constructor(private acopioService: AcopioService,private clientesService: ClientesService,private choferesService: ChoferesService,private camionesService:CamionesService) { }

  ngOnInit(): void {
    this.obtenerAcopios();
    this.obtenerClientes(); 
    this.obtenerChoferes();
    this.obtenerCamiones();

  }
  obtenerClientes() {
    this.clientesService.obtenerClientes().subscribe(
      data => this.clientes = data,
      error => console.error('Error al obtener clientes:', error)
    );
  }
  obtenerChoferes(){
    this.choferesService.obtenerChoferes().subscribe(
      data => this.choferes = data,
      error => console.error('Error al obtener Choferes')
    );
  }
 
  obtenerCamiones() {
    this.camionesService.obtenerCamiones().subscribe(
      data => this.camiones = data,
      error => console.error('Error al obtener camiones:', error)
    );
  }

  inicializarAcopio() {
    return {
      Fecha: '',
      id_cliente: null,
      id_chofer: null,
      id_camion: null,
      Cantidad: null,
      Estado: null
    };
  }

  obtenerAcopios() {
    this.acopioService.obtenerAcopios().subscribe(
      data => this.acopios = data,
      error => console.error('Error al obtener acopios:', error)
    );
  }

  crearAcopio() {
    this.acopioService.crearAcopio(this.nuevoAcopio).subscribe(
      data => {
        this.acopios.push(data);
        this.cerrarFormulario();
        this.obtenerAcopios(); // Asegura que la lista se actualice
      },
      error => console.error('Error al crear acopio:', error)
    );
  }

  actualizarAcopio() {
    if (this.acopioSeleccionado) {
      this.acopioService.actualizarAcopio(this.acopioSeleccionado.id_acopio, this.nuevoAcopio).subscribe(
        data => {
          const index = this.acopios.findIndex(a => a.id_acopio === data.id_acopio);
          if (index !== -1) {
            this.acopios[index] = data;
          }
          this.cerrarFormulario();
          this.obtenerAcopios(); // Asegura que la lista se actualice
        },
        error => console.error('Error al actualizar acopio:', error)
      );
    }
  }

  eliminarAcopio(id: number) {
    this.acopioService.eliminarAcopio(id).subscribe(
      () => {
        this.acopios = this.acopios.filter(a => a.id_acopio !== id);
      },
      error => console.error('Error al eliminar acopio:', error)
    );
  }

  seleccionarAcopio(acopio: any) {
    this.modoEdicion = true;
    this.acopioSeleccionado = acopio;
    this.nuevoAcopio = { ...acopio };
    this.nuevoAcopio.id_cliente = acopio.cliente_id_cliente; 
    this.nuevoAcopio.id_chofer = acopio.chofer_id_chofer;
    this.nuevoAcopio.id_camion = acopio.camion_id_camion;
    this.mostrarFormulario = true;
  }
  
  
  cerrarFormulario() {
    this.modoEdicion = false;
    this.acopioSeleccionado = null;
    this.nuevoAcopio = this.inicializarAcopio();
    this.mostrarFormulario = false;
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cerrarFormulario();
    }
  }
}
