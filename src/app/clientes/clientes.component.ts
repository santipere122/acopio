import { Component, OnInit, AfterViewInit,AfterViewChecked  } from '@angular/core';
import { Cliente } from './clientes.interface';
import { ClientesService } from '../clientes.service';
import { ChoferesService } from '../choferes.service';
import { CamionesService } from '../camiones.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit {
  mostrarFormulario = false;
  modoEdicion = false;
  clientes: Cliente[] = [];
  choferes: any[] = [];
  camiones: any[] = [];
  codigosPostales: any[] = [];
  clienteSeleccionado: Cliente | null = null;
  nuevoCliente: Cliente = this.initNuevoCliente();
  formulario: FormGroup;
  private map: any;
  private mapInitialized = false;
  private markers: any[] = [];
  private currentMarker: any;
  displayedColumns: string[] = ['Nombre', 'Dni', 'Telefono', 'Codigo_postal', 'Region', 'Direccion', 'Nombre_contacto', 'Telefono_contacto', 'Fecha_ultima_visita', 'Intervalo_de_visita', 'Estado', 'Chofer', 'Camion', 'ACCIONES'];



  constructor(
    private http: HttpClient,
    private clientesService: ClientesService,
    private router: Router,
    private choferesService: ChoferesService,
    private camionesService: CamionesService,
    private authservice: AuthService,
    private locationService: LocationService,
    private fb: FormBuilder

  ) {
    this.formulario = this.fb.group({
      codigoPostal: [''],
      ubicacionAcopio: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.cargarChoferes();
    this.cargarCamiones();
  
    this.formulario.get('Codigo_postal')?.valueChanges.subscribe(value => {
      this.seleccionarCodigoPostal(value);
    });
    this.formulario.get('Direccion')?.valueChanges.subscribe(value => {
      this.actualizarDireccion(value);
    });
    if (this.modoEdicion && this.clienteSeleccionado) {
      setTimeout(() => {
        this.initMap();
        this.actualizarMapa();
      }, 0);
    }
  }
  ngAfterViewInit(): void {
    if (!this.mapInitialized) {
      setTimeout(() => {
        if (typeof google !== 'undefined' && google.maps) {
          this.initMap();
          this.mapInitialized = true;
        } else {
          console.error('Google Maps API no está disponible.');
        }
      }, 0);
    }
  }
  private initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemento del mapa no encontrado');
      return;
    }
    console.log('Inicializando el mapa...');
    this.map = new google.maps.Map(mapElement, {
      center: { lat: 37.0902, lng: -95.7129 },
      zoom: 3.55
    });
  }
  
  isAdmin(): boolean {
    return this.authservice.isAdmin();
  }
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.nuevoCliente = this.initNuevoCliente();
    if (this.mostrarFormulario) {
      setTimeout(() => {
        this.initMap(); 
        this.actualizarMapa();
      }, 0);
    } else {
      this.map = null;
    }
  }
  
  obtenerClientes() {
    this.clientesService.obtenerClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
      },
      (error) => {
        console.error('Error al obtener clientes:', error);
      }
    );
  }

  cargarChoferes(): void {
    this.choferesService.obtenerChoferes().subscribe(
      (data) => {
        this.choferes = data;
      },
      (error) => {
        console.error('Error al obtener choferes', error);
      }
    );
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

  crearCliente() {
    this.clientesService.crearCliente(this.nuevoCliente).subscribe(
      (data: Cliente) => {
        this.clientes.push(data);
        console.log('Cliente creado exitosamente', data);
        this.mostrarFormulario = false;
        this.nuevoCliente = this.initNuevoCliente();
      },
      (error) => {
        console.error('Error al crear el cliente:', error);
      }
    );
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = { ...cliente };
    this.nuevoCliente = { ...cliente };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    setTimeout(() => {
      this.initMap();
      this.actualizarMapa();
    }, 0);
  }

  actualizarCliente() {
    if (this.clienteSeleccionado) {
      this.clientesService
        .actualizarCliente(this.clienteSeleccionado.id_cliente, this.nuevoCliente)
        .subscribe(
          (data: Cliente) => {
            const index = this.clientes.findIndex(
              (c) => c.id_cliente === this.clienteSeleccionado!.id_cliente
            );
            this.clientes[index] = data;
            console.log('Cliente actualizado exitosamente', data);
            this.mostrarFormulario = false;
            this.clienteSeleccionado = null;
            this.nuevoCliente = this.initNuevoCliente();
          },
          (error) => {
            console.error('Error al actualizar el cliente:', error);
          }
        );
    }
  }

  eliminarCliente(id: number) {
    const confirmacion = confirm(
      '¿Estás seguro de que quieres eliminar este cliente?'
    );
    if (confirmacion) {
      this.clientesService.eliminarCliente(id).subscribe(
        () => {
          this.clientes = this.clientes.filter((c) => c.id_cliente !== id);
          console.log('Cliente eliminado exitosamente');
        },
        (error) => {
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
      Estado: 1,
      camion_defecto: '',
      chofer_defecto: '',
      id_camion: 0,
      id_chofer: 0,
    };
  }

  obtenerNombreChofer(id_chofer: number): string {
    const chofer = this.choferes.find((c) => c.id_chofer === id_chofer);
    return chofer ? chofer.Nombre : 'Sin asignar';
  }

  obtenerIdentificadorCamion(id_camion: number): string {
    const camion = this.camiones.find((c) => c.id_camion === id_camion);
    return camion ? camion.Identificador : 'Sin asignar';
  }
  obtenerCoordenadas(codigoPostal: string, ubicacionAcopio: string) {
    let direccion = `${ubicacionAcopio}, ${codigoPostal}`.trim();
      if (!ubicacionAcopio) {
      direccion = codigoPostal;
    } else if (!codigoPostal) {
      direccion = ubicacionAcopio;
    }
  
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${direccion}&key=AIzaSyBMUMb8fd9CJzaurCfLZe7neoTJzJ_lnsE`;
  
    return this.http.get(url).pipe(
        map((response: any) => {
        if (response.results && response.results.length > 0) {
          return response.results[0].geometry.location;
        } else {
          throw new Error('No se encontraron resultados de coordenadas');
        }
      }),
        catchError(error => {
        console.error('Error al obtener las coordenadas:', error);
        return throwError(error);
      })
    );
  }

  agregarPin(cliente: any) {
    this.obtenerCoordenadas(cliente.Codigo_postal, cliente.Direccion).subscribe(
      coordenadas => {
        const marker = new google.maps.Marker({
          position: coordenadas,
          map: this.map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }
        });
        this.markers.push(marker);
      },
      error => console.error('Error al obtener las coordenadas:', error)
    );
  }
  
  actualizarPines() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
        if (this.modoEdicion && this.clienteSeleccionado) {
      this.agregarPin(this.clienteSeleccionado); 
    } else {
      this.clientes.forEach(cliente => this.agregarPin(cliente));
    }
  }
  
  obtenerSugerenciasCodigoPostal(event: any) {
    const input = event.target.value;
    if (input.length > 2) {
      this.locationService.getCodigosPostales(input).subscribe(
        (data: any[]) => {
          this.codigosPostales = data.map((item: any) => item.codigo_postal);
        },
        error => console.error('Error al obtener códigos postales:', error)
      );
    } else {
      this.codigosPostales = [];
    }
  }
  
  seleccionarCodigoPostal(codigoPostal: string) {
    this.nuevoCliente.Codigo_postal = codigoPostal;
    this.codigosPostales = [];
  
    if (!codigoPostal) {
      this.nuevoCliente.Direccion = ''; 
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
        this.currentMarker = null;
      }
      return;
    }
  
    this.obtenerCoordenadas(codigoPostal, this.nuevoCliente.Direccion).subscribe(
      coordenadas => {
        this.nuevoCliente.Latitud = coordenadas.lat;
        this.nuevoCliente.Longitud = coordenadas.lng;
  
        if (this.currentMarker) {
          this.currentMarker.setMap(null);
        }
  
        this.currentMarker = new google.maps.Marker({
          position: coordenadas,
          map: this.map,
          title: 'Ubicación seleccionada',
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });
  
        this.map.setCenter(coordenadas);
        this.map.setZoom(15);
      },
      error => console.error('Error al obtener las coordenadas:', error)
    );
  }  
  actualizarDireccion(Direccion: string) {
    this.nuevoCliente.Direccion = Direccion;
      if (!Direccion && !this.nuevoCliente.Direccion) {
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
        this.currentMarker = null;
      }
      return;
    }
      this.actualizarCoordenadas();
  }
  actualizarCoordenadas() {
    this.obtenerCoordenadas(this.nuevoCliente.Codigo_postal, this.nuevoCliente.Direccion).subscribe(
      coordenadas => {
        this.nuevoCliente.Latitud = coordenadas.lat;
        this.nuevoCliente.Longitud = coordenadas.lng;
  
        if (this.currentMarker) {
          this.currentMarker.setMap(null);
        }
  
        this.currentMarker = new google.maps.Marker({
          position: coordenadas,
          map: this.map,
          title: 'Ubicación seleccionada',
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });
  
        this.map.setCenter(coordenadas);
        this.map.setZoom(15);
      },
      error => console.error('Error al obtener las coordenadas:', error)
    );
  }
  
  actualizarPin() {
    if (this.nuevoCliente.Direccion) {
      this.actualizarCoordenadas();
    }
}
private actualizarMapa(): void {
  if (this.map) {
    if (this.modoEdicion && this.clienteSeleccionado) {
      this.map.setCenter({ lat: this.clienteSeleccionado.Latitud, lng: this.clienteSeleccionado.Longitud });
      this.map.setZoom(15);
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
      }
      this.currentMarker = new google.maps.Marker({
        position: { lat: this.clienteSeleccionado.Latitud, lng: this.clienteSeleccionado.Longitud },
        map: this.map,
        title: this.clienteSeleccionado.Direccion,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
      });
    } else if (this.mostrarFormulario) {
      this.map.setCenter({ lat: 37.0902, lng: -95.7129 },);
      this.map.setZoom(3.55);  
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
      }
    }
  }
}
estadoTexto(estado: 0 | 1): string {
  return estado === 1 ? 'Activo' : 'Inactivo';
}

}