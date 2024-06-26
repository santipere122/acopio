import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcopioService } from '../acopio.service';
import { ClientesService } from '../clientes.service';
import { ChoferesService } from '../choferes.service';
import { LocationService } from '../location.service'; 
import { CamionesService } from '../camiones.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';


declare var google: any; 

@Component({
  selector: 'app-acopio',
  templateUrl: './acopio.component.html',
  styleUrls: ['./acopio.component.css']
})
export class AcopioComponent implements OnInit, AfterViewInit, AfterViewChecked {
  acopios: any[] = [];
  clientes: any[] = []; 
  choferes: any[] = [];
  camiones: any[] = [];
  estados: any[] = [];
  condados: any[] = [];
  ciudades: any[] = [];
  codigosPostales: any[] = [];
  nuevoAcopio: any = this.inicializarAcopio();
  mostrarFormulario = false;
  modoEdicion = false;
  acopioSeleccionado: any = null;
  private map: any;
  private mapInitialized = false;
  private markers: any[] = [];
  private currentMarker: any;
  formulario: FormGroup;

  constructor(
    private http: HttpClient,
    private acopioService: AcopioService,
    private clientesService: ClientesService,
    private choferesService: ChoferesService,
    private camionesService: CamionesService,
    private locationService: LocationService,
    private fb: FormBuilder
  ) { 
    this.formulario = this.fb.group({
      codigoPostal: [''],
      ubicacionAcopio: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerAcopios();
    this.obtenerClientes();
    this.obtenerChoferes();
    this.obtenerCamiones();
    this.obtenerEstados();

    this.formulario.get('codigoPostal')?.valueChanges.subscribe(value => {
      this.seleccionarCodigoPostal(value);
    });

    this.formulario.get('ubicacionAcopio')?.valueChanges.subscribe(value => {
      this.actualizarUbicacionAcopio(value);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  ngAfterViewChecked(): void {
    if (this.mapInitialized) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  private initMap(): void {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 37.0902, lng: -95.7129 }, 
        zoom: 3.55
      });
      this.mapInitialized = true;
      this.actualizarPines();
    }
  }

  obtenerEstados() {
    this.locationService.getEstados().subscribe(
      data => this.estados = data,
      error => console.error('Error al obtener estados:', error)
    );
  }

  obtenerCondados(estado: string) {
    this.locationService.getCondados(estado).subscribe(
      data => this.condados = data,
      error => console.error('Error al obtener condados:', error)
    );
  }

  obtenerCiudades(estado: string, condado: string) {
    this.locationService.getCiudades(estado, condado).subscribe(
      data => this.ciudades = data,
      error => console.error('Error al obtener ciudades:', error)
    );
  }

  obtenerClientes() {
    this.clientesService.obtenerClientes().subscribe(
      data => this.clientes = data,
      error => console.error('Error al obtener clientes:', error)
    );
  }

  obtenerChoferes() {
    this.choferesService.obtenerChoferes().subscribe(
      data => this.choferes = data,
      error => console.error('Error al obtener choferes:', error)
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
      Estado: null,     
      ubicacion_acopio: null,
      latitud: null,
      longitud: null,
      codigo_postal: null
    };
  }

  onEstadoChange(codigo_estado: string) {
    this.nuevoAcopio.codigo_estado = codigo_estado;
    this.nuevoAcopio.codigo_condado = null; 
    this.nuevoAcopio.codigo_ciudad = null; 
    this.obtenerCondados(codigo_estado);
  }

  obtenerAcopios() {
    this.acopioService.obtenerAcopios().subscribe(
      data => {
        this.acopios = data;
        if (!this.modoEdicion) {
          this.actualizarPines();
        }
      },
      error => console.error('Error al obtener acopios:', error)
    );
  }
  crearAcopio() {
    this.acopioService.crearAcopio(this.nuevoAcopio).subscribe(
      data => {
        this.acopios.push(data);
        this.cerrarFormulario();
        this.obtenerAcopios();
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
    this.obtenerAcopios();
    this.actualizarPines();
    },
    error => console.error('Error al actualizar acopio:', error)
    );
    }
    }
 

  eliminarAcopio(id: number) {
    this.acopioService.eliminarAcopio(id).subscribe(
      () => {
        this.acopios = this.acopios.filter(a => a.id_acopio !== id);
        if (!this.modoEdicion) {
          this.actualizarPines();
        }
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
    this.nuevoAcopio.ubicacion_acopio = acopio.ubicacion_acopio;
    this.mostrarFormulario = true;

    setTimeout(() => {
      if (!this.mapInitialized) {
        this.initMap();
      } else {
        google.maps.event.trigger(this.map, 'resize');
        this.actualizarPines();
      }
    }, 0);
  }

  cerrarFormulario() {
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
      this.currentMarker = null;
    }
    this.map.setCenter({ lat: 37.0902, lng: -95.7129 });
    this.map.setZoom(4);
    this.modoEdicion = false;
    this.acopioSeleccionado = null;
    this.nuevoAcopio = this.inicializarAcopio();
    this.mostrarFormulario = false;
    this.actualizarPines();
  }
  
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cerrarFormulario();
    } else {
      setTimeout(() => {
        if (!this.mapInitialized) {
          this.initMap();
        } else {
          google.maps.event.trigger(this.map, 'resize');
        }
      }, 0);
    }
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
  
  agregarPin(acopio: any) {
    this.obtenerCoordenadas(acopio.codigo_postal, acopio.ubicacion_acopio).subscribe(
      coordenadas => {
        const marker = new google.maps.Marker({
          position: coordenadas,
          map: this.map,
          title: `Acopio ${acopio.id_acopio}`, 
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
  
    if (this.modoEdicion && this.acopioSeleccionado) {
      this.agregarPin(this.acopioSeleccionado);
    } else {
      this.acopios.forEach(acopio => this.agregarPin(acopio));
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
    this.nuevoAcopio.codigo_postal = codigoPostal;
    this.codigosPostales = [];
  
    if (!codigoPostal) {
      this.nuevoAcopio.ubicacion_acopio = ''; 
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
        this.currentMarker = null;
      }
      return;
    }
  
    this.obtenerCoordenadas(codigoPostal, this.nuevoAcopio.ubicacion_acopio).subscribe(
      coordenadas => {
        this.nuevoAcopio.latitud = coordenadas.lat;
        this.nuevoAcopio.longitud = coordenadas.lng;
  
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
  actualizarUbicacionAcopio(ubicacionAcopio: string) {
    this.nuevoAcopio.ubicacion_acopio = ubicacionAcopio;
      if (!ubicacionAcopio && !this.nuevoAcopio.codigo_postal) {
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
        this.currentMarker = null;
      }
      return;
    }
      this.actualizarCoordenadas();
  }
  actualizarCoordenadas() {
    this.obtenerCoordenadas(this.nuevoAcopio.codigo_postal, this.nuevoAcopio.ubicacion_acopio).subscribe(
      coordenadas => {
        this.nuevoAcopio.latitud = coordenadas.lat;
        this.nuevoAcopio.longitud = coordenadas.lng;
  
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
    if (this.nuevoAcopio.ubicacion_acopio) {
      this.actualizarCoordenadas();
    }
}


}
