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
import * as L from 'leaflet';
import 'leaflet.markercluster';


delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/leaflet-images/marker-icon-2x.png',
  iconUrl:       '/assets/leaflet-images/marker-icon.png',
  shadowUrl:     '/assets/leaflet-images/marker-shadow.png',
});


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
  private map!: L.Map;
  private mapInitialized = false;
  private markerCluster: any;
  private currentMarker: L.Marker | null = null;


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
        this.initMap();
        this.mapInitialized = true;
      }, 0);
    }
  }
  private initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map = L.map(mapElement).setView([37.0902, -95.7129], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerCluster = L.markerClusterGroup();
    this.map.addLayer(this.markerCluster);
  }

  isAdmin(): boolean {
    return this.authservice.isAdmin();
  }
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.nuevoCliente = this.initNuevoCliente();

    if (this.mostrarFormulario) {
      // Cuando abrimos el formulario, inicializamos Leaflet
      setTimeout(() => {
        this.initMap();
        this.actualizarMapa();
      }, 0);
    } else {
      // Cuando cerramos, removemos el mapa y limpiamos marcadores
      if (this.map) {
        this.map.remove();           // destruye la instancia de Leaflet
        this.mapInitialized = false;
      }
      // opcional: limpiar cluster
      if (this.markerCluster) {
        this.markerCluster.clearLayers();
      }
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

  private obtenerCoordenadas(codigoPostal: string, ubicacion: string) {
    let direccion = `${ubicacion}, ${codigoPostal}`.trim();
    if (!ubicacion) {
      direccion = codigoPostal;
    } else if (!codigoPostal) {
      direccion = ubicacion;
    }

    const base   = 'https://nominatim.openstreetmap.org/search';
    const params = [
      'format=json',
      'limit=1',
      `q=${encodeURIComponent(direccion)}`,
      'countrycodes=us'
    ].join('&');

    const url = `${base}?${params}`;
    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (!results.length) {
          throw new Error('No se encontraron resultados de geocodificación');
        }
        return {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon)
        };
      }),
      catchError(err => {
        console.error('Error al geocodificar con Nominatim', err);
        return throwError(err);
      })
    );
  }

  agregarPin(cliente: any) {
    const direccion = `${cliente.Direccion}, ${cliente.Codigo_postal}, ${cliente.Region}`;
    this.geocodificarDireccion(direccion).subscribe(
      ({ lat, lng }) => {
        const icon = L.icon({
          iconUrl: '/assets/leaflet-images/marker-icon.png',
          iconRetinaUrl: '/assets/leaflet-images/marker-icon-2x.png',
          shadowUrl: '/assets/leaflet-images/marker-shadow.png',
          iconSize:    [25, 41],
          iconAnchor:  [12, 41],
          popupAnchor: [1, -34],
          shadowSize:  [41, 41]
        });
        const marker = L.marker([lat, lng], { icon })
          .bindPopup(`<strong>${cliente.Nombre}</strong><br>${cliente.Direccion}`);
        this.markerCluster.addLayer(marker);
      },
      err => console.error('No se pudo geocodificar la dirección:', err)
    );
  }



  actualizarPines() {
    if (!this.nuevoCliente.Direccion || !this.nuevoCliente.Codigo_postal) return;

  const direccionCompleta = `${this.nuevoCliente.Direccion}, ${this.nuevoCliente.Codigo_postal}, ${this.nuevoCliente.Region}`;

  this.geocodificarDireccion(direccionCompleta).subscribe((coordenadas: { lat: number; lng: number }) => {
    this.nuevoCliente.Latitud = coordenadas.lat;
    this.nuevoCliente.Longitud = coordenadas.lng;
    this.actualizarMapaFormulario(); // <- esto debería dibujar el pin nuevo
  });
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
      // limpiar marcador anterior
      if (this.currentMarker) {
        this.markerCluster.removeLayer(this.currentMarker);
        this.currentMarker = null;
      }
      return;
    }

    this.obtenerCoordenadas(codigoPostal, this.nuevoCliente.Direccion).subscribe(
      coordenadas => {
        this.nuevoCliente.Latitud = coordenadas.lat;
        this.nuevoCliente.Longitud = coordenadas.lng;

        // limpiar marcador anterior
        if (this.currentMarker) {
          this.markerCluster.removeLayer(this.currentMarker);
        }

        // crear nuevo marcador Leaflet
        this.currentMarker = L.marker([coordenadas.lat, coordenadas.lng], {
          icon: L.icon({
            iconUrl: '/assets/leaflet-images/marker-icon.png',
            iconRetinaUrl: '/assets/leaflet-images/marker-icon-2x.png',
            shadowUrl: '/assets/leaflet-images/marker-shadow.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            shadowSize:  [41, 41]
          })
        }).bindPopup('Ubicación seleccionada');

        // añadir al cluster
        this.markerCluster.addLayer(this.currentMarker);

        // centrar y hacer zoom
        this.map.setView([coordenadas.lat, coordenadas.lng], 15);
      },
      error => console.error('Error al obtener las coordenadas:', error)
    );
  }

  actualizarDireccion(Direccion: string) {
    this.nuevoCliente.Direccion = Direccion;
    if (!Direccion && !this.nuevoCliente.Codigo_postal) {
      if (this.currentMarker) {
        this.markerCluster.removeLayer(this.currentMarker);
        this.currentMarker = null;
      }
      return;
    }
    this.actualizarCoordenadas();
  }

  actualizarCoordenadas() {
  this.obtenerCoordenadas(this.nuevoCliente.Codigo_postal, this.nuevoCliente.Direccion)
    .subscribe(coordenadas => {
      this.nuevoCliente.Latitud = coordenadas.lat;
      this.nuevoCliente.Longitud = coordenadas.lng;

      if (this.currentMarker) {
        this.markerCluster.removeLayer(this.currentMarker);
      }

      this.currentMarker = L.marker([coordenadas.lat, coordenadas.lng], {
        icon: L.icon({
          iconUrl: '/assets/leaflet-images/marker-icon.png',
          iconRetinaUrl: '/assets/leaflet-images/marker-icon-2x.png',
          shadowUrl: '/assets/leaflet-images/marker-shadow.png',
          iconSize:    [25, 41],
          iconAnchor:  [12, 41],
          popupAnchor: [1, -34],
          shadowSize:  [41, 41]
        })
      }).bindPopup('Ubicación seleccionada');

      this.markerCluster.addLayer(this.currentMarker);
      this.map.setView([coordenadas.lat, coordenadas.lng], 15);
    },
    error => console.error('Error al obtener las coordenadas:', error)
  );
}


actualizarPin() {
  if (this.nuevoCliente.Direccion || this.nuevoCliente.Codigo_postal) {
    this.actualizarCoordenadas();
  }
}

private actualizarMapa(): void {
  if (!this.map) return;

  if (this.currentMarker) {
    this.markerCluster.removeLayer(this.currentMarker);
    this.currentMarker = null;
  }

  if (this.modoEdicion && this.clienteSeleccionado) {
    const { Latitud: lat, Longitud: lng, Direccion } = this.clienteSeleccionado;

    const defaultIcon = L.icon({
      iconUrl: '/assets/leaflet-images/marker-icon.png',
      iconRetinaUrl: '/assets/leaflet-images/marker-icon-2x.png',
      shadowUrl: '/assets/leaflet-images/marker-shadow.png',
      iconSize:    [25, 41],
      iconAnchor:  [12, 41],
      popupAnchor: [1, -34],
      shadowSize:  [41, 41]
    });

    this.currentMarker = L.marker([lat, lng], { icon: defaultIcon })
      .bindPopup(Direccion);

    this.markerCluster.addLayer(this.currentMarker);
    this.map.setView([lat, lng], 15);

  } else if (this.mostrarFormulario) {
    this.map.setView([37.0902, -95.7129], 4);
  }
}


estadoTexto(estado: 0 | 1): string {
  return estado === 1 ? 'Activo' : 'Inactivo';
}
private actualizarMapaFormulario() {
  if (!this.nuevoCliente.Direccion || !this.nuevoCliente.Codigo_postal) return;
  const direccion = `${this.nuevoCliente.Direccion}, ${this.nuevoCliente.Codigo_postal}, ${this.nuevoCliente.Region}`;
  this.geocodificarDireccion(direccion).subscribe(
    ({ lat, lng }) => {
      if (this.currentMarker) {
        this.markerCluster.removeLayer(this.currentMarker);
        this.currentMarker = null;
      }
      this.currentMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: '/assets/leaflet-images/marker-icon.png',
          iconRetinaUrl: '/assets/leaflet-images/marker-icon-2x.png',
          shadowUrl: '/assets/leaflet-images/marker-shadow.png',
          iconSize:    [25, 41],
          iconAnchor:  [12, 41],
          popupAnchor: [1, -34],
          shadowSize:  [41, 41]
        })
      }).bindPopup('Ubicación seleccionada');
      this.markerCluster.addLayer(this.currentMarker);
      this.map.setView([lat, lng], 15);
    },
    err => console.error('Error al actualizar pin:', err)
  );
}

private geocodificarDireccion(direccion: string) {
  const base   = 'https://nominatim.openstreetmap.org/search';
  const params = [
    'format=json',
    'limit=1',
    `q=${encodeURIComponent(direccion)}`,
    'countrycodes=us'
  ].join('&');

  const url = `${base}?${params}`;
  return this.http.get<any[]>(url).pipe(
    map(results => {
      if (!results.length) throw new Error('No hay resultados de geocodificación');
      return { lat: +results[0].lat, lng: +results[0].lon };
    }),
    catchError(err => {
      console.error('Error geocodificando con Nominatim:', err);
      return throwError(err);
    })
  );
}


}
