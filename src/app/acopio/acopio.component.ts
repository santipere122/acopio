import { Component, OnInit, AfterViewInit, AfterViewChecked,ViewChild,ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { AcopioService } from '../acopio.service';
import { ClientesService } from '../clientes.service';
import { ChoferesService } from '../choferes.service';
import { LocationService } from '../location.service';
import { CamionesService } from '../camiones.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';

declare var google: any;

@Component({
  selector: 'app-acopio',
  templateUrl: './acopio.component.html',
  styleUrls: ['./acopio.component.css']
})

export class AcopioComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('printSection') printSection!: ElementRef;
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
  acopiosFiltrados: any[] = [];
  filtroFecha: string | null = null;
  acopiosProgramados: any[] = []; 
  programarAcopioForm: FormGroup;
  filtroacopio:string | null=null;
  filtroChofer:string | null=null;
  filtroEstado:string | null=null;
  mostrarFormularioCompletar: boolean = false;
  completarAcopioForm: FormGroup;


  constructor(
    private http: HttpClient,
    private acopioService: AcopioService,
    private clientesService: ClientesService,
    private choferesService: ChoferesService,
    private camionesService: CamionesService,
    private locationService: LocationService,
    private authservice: AuthService,
    private fb: FormBuilder
  ) {
   
    this.formulario = this.fb.group({
      codigoPostal: [''],
      ubicacionAcopio: ['']
    });
     this.programarAcopioForm = this.fb.group({
      chofer: [''],
      camion: ['']
    });
    this.completarAcopioForm = this.fb.group({
      monto_pagar: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    this.filtroFecha = new Date().toISOString().split('T')[0];
    this.filtroChofer = null;
    this.filtroEstado = '0';
    this.obtenerAcopios();
    this.obtenerClientes();
    this.obtenerChoferes();
    this.obtenerCamiones();
    this.obtenerEstados();
  
    const idChofer = this.authservice.getIdChofer();
    if (idChofer !== null && +idChofer >= 0) {
      this.filtroChofer = idChofer.toString();
    } else {
      this.filtroChofer = null;  
    }
  
    this.aplicarFiltro();
  
    this.formulario.get('codigoPostal')?.valueChanges.subscribe(value => {
      this.seleccionarCodigoPostal(value);
      this.actualizarPin();
    });
  
    this.formulario.get('ubicacionAcopio')?.valueChanges.subscribe(value => {
      this.nuevoAcopio.direccion = value;
      this.actualizarPin();
    });
  
    this.completarAcopioForm = this.fb.group({
      monto_pagar: ['', [Validators.required]]
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


  isAdmin(): boolean {
    return this.authservice.isAdmin();
  }

  isChofer():boolean {
    return this.authservice.isChofer();
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
      data => {
        this.choferes = data;
        this.setChoferFromToken(); 
      },
      error => console.error('Error al obtener choferes:', error)
    );
  }

  obtenerCamiones() {
    this.camionesService.obtenerCamiones().subscribe(
      data => {
        this.camiones = data;
        this.setCamionFromToken();
      },
      error => console.error('Error al obtener camiones:', error)
    );
  }

  inicializarAcopio() {
    return {
      Fecha: '',
      id_cliente: null,
      id_chmion: null,
      Cantiofer: null,
      id_cadad: null,
      Estado: null,
      direccion: null,
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
        this.acopios = data.map(acopio => ({
          ...acopio,
          EstadoTexto: this.convertirEstado(acopio.Estado)
        }));
        this.filtrarPorFechaYChofer();
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
          this.obtenerAcopios();
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
    this.nuevoAcopio.direccion = acopio.direccion;
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
        return throwError(error);
      })
    );
  }

  agregarPin(acopio: any) {
    this.obtenerCoordenadas(acopio.codigo_postal, acopio.direccion).subscribe(
      coordenadas => {
        const marker = new google.maps.Marker({
          position: coordenadas,
          map: this.map,
          title: `Acopio ${acopio.Cliente_Nombre},${acopio.EstadoTexto},a cargo de ${acopio.Chofer_Nombre}`  ,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          },
        });
        this.markers.push(marker);
      },
    );
  }
  actualizarPines() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  
    if (this.modoEdicion && this.acopioSeleccionado) {
      this.agregarPin(this.acopioSeleccionado);
    } else if (this.filtroFecha && this.acopiosFiltrados.length > 0) {
      this.acopiosFiltrados.forEach(acopio => this.agregarPin(acopio));
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
      );
    } else {
      this.codigosPostales = [];
    }
  }

  seleccionarCodigoPostal(codigoPostal: string) {
    this.nuevoAcopio.codigo_postal = codigoPostal;
    this.codigosPostales = [];
  
    if (!codigoPostal) {
      this.nuevoAcopio.direccion = '';
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
        this.currentMarker = null;
      }
      return;
    }
    this.actualizarPin();
  }
  
  actualizarUbicacionAcopio(ubicacionAcopio: string) {
    this.nuevoAcopio.direccion = ubicacionAcopio;
    if (!ubicacionAcopio && !this.nuevoAcopio.codigo_postal) {
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
        this.currentMarker = null;
        this.actualizarPin();
      }
      return;
    }
    this.actualizarCoordenadas();
  }

  actualizarCoordenadas() {
    this.obtenerCoordenadas(this.nuevoAcopio.codigo_postal, this.nuevoAcopio.direccion).subscribe(
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
    );
  }

  actualizarPin() {
    this.obtenerCoordenadas(this.nuevoAcopio.codigo_postal, this.nuevoAcopio.direccion).subscribe(
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
    );
  }

  filtrarPorFecha() {
    if (this.filtroFecha) {
      this.acopiosFiltrados = this.acopios.filter(acopio => acopio.Fecha === this.filtroFecha);
    } else {
      this.acopiosFiltrados = [...this.acopios];
      this.actualizarPines()
    }
  }

  filtrarPorChofer() {
      if (this.filtroChofer) {
      const filtroChoferNum = parseInt(this.filtroChofer, 10);
      this.acopiosFiltrados = this.acopios.filter(acopio => acopio.chofer_id_chofer === filtroChoferNum);
    } else {
      this.acopiosFiltrados = [...this.acopios];
    }
    
    this.actualizarPines();
  }
  filtrarPorFechaYChofer() {
    const idChoferStr = this.authservice.getIdChofer();
    const idChofer = idChoferStr !== null ? +idChoferStr : -1;
  
    this.acopiosFiltrados = this.acopios.filter(acopio => {
      const fechaCumple = !this.filtroFecha || acopio.Fecha === this.filtroFecha;
      const choferCumple = idChofer < 0 || this.filtroChofer === null || this.filtroChofer === '' || acopio.chofer_id_chofer === parseInt(this.filtroChofer, 10);
      const estadoNumCumple = !this.filtroEstado || this.filtroEstado === '' || acopio.Estado === parseInt(this.filtroEstado, 10);
  
      return fechaCumple && choferCumple && estadoNumCumple;
    });
  
    this.actualizarPines();
  }
  
  aplicarFiltro() {
    this.filtrarPorFechaYChofer();
    this.actualizarPines();
    if (this.acopiosFiltrados.length === 0) {
    }
    this.actualizarPines();
  }
  
  quitarFiltro() {
    const idChoferstr = this.authservice.getIdChofer();
    const idChofer = idChoferstr !== null ? +idChoferstr : -1;
  
    if (idChofer > 0) {
      this.filtroEstado = null;
    } else {
      this.filtroFecha = null;
      this.filtroChofer = null;
      this.filtroEstado = null;
    }
  
    this.aplicarFiltro();
  }
  iniciarDia() {
    const chofer = this.programarAcopioForm.get('chofer')?.value;
    const camion = this.programarAcopioForm.get('camion')?.value;
    const fechaHoy = new Date().toISOString().split('T')[0];

    this.filtroFecha = fechaHoy;
    this.filtroChofer = chofer;

    this.acopioService.inicializarAcopios(fechaHoy, chofer, camion).subscribe(
      data => {
        this.obtenerAcopios(); 
        this.filtrarPorFechaYChofer();
      },
    );
  }

  setChoferFromToken() {
    const id_chofer = this.authservice.getIdChofer();
    if (id_chofer && this.choferes.length > 0) {
      this.programarAcopioForm.get('chofer')?.setValue(id_chofer);
    }
  }

 setCamionFromToken(){
  const id_camion = this.authservice.getIdCamion();
  if (id_camion && this.camiones.length > 0) {
    this.programarAcopioForm.get('camion')?.setValue(id_camion);
 }
}
 
  downloadPDF(): void {
    const doc = new jsPDF();
    const printSection = this.printSection.nativeElement;
    const elementosOcultar = printSection.querySelectorAll('.no-print') as NodeListOf<HTMLElement>;
    elementosOcultar.forEach(elemento => {
      elemento.style.display = 'none';
    });
    const options = {
      format: 'a4',
      x: 10,
      y: 10,
      html2canvas: { scale: 0.250 },
      callback: (doc: jsPDF) => {
        doc.save('acopios.pdf');
        elementosOcultar.forEach(elemento => {
          elemento.style.display = '';
        });
      }
    };
    const maxHeight = 800; 
    printSection.style.height = Math.min(printSection.scrollHeight, maxHeight) + 'px';
    doc.html(printSection, options);
  }

  Impirmir(): void {
    const printContents = this.printSection.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


  convertirEstado(estado: number): string {
    switch (estado) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'Realizado';
      case 2:
        return 'Anulado';
      default:
        return 'Desconocido';
    }
  }
  mostrarFormularioCompletarAcopio(acopio: any) {
    this.acopioSeleccionado = acopio;
    this.mostrarFormularioCompletar = true;
    this.completarAcopioForm.reset();
  }
  completarAcopio() {
    if (this.completarAcopioForm.valid && this.acopioSeleccionado) {
      const { monto_pagar } = this.completarAcopioForm.value;
      const fecha = new Date().toISOString().split('T')[0]; 
      
      this.acopioService.completarAcopio(this.acopioSeleccionado.id_acopio, monto_pagar, fecha).subscribe(
        response => {
          this.obtenerAcopios(); 
          this.mostrarFormularioCompletar = false; 
        },
      );
    }
  }
  cerrarModal() {
    this.mostrarFormularioCompletar = false;
  }
  
}