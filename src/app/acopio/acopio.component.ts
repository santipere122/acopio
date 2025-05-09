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


import * as L from 'leaflet';




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
  private map!: L.Map;
  private mapInitialized = false;
  private markers: L.Marker[] = [];
  private currentMarker?: L.Marker;
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
  displayedColumns: string[] = [
    'Fecha', 'Cliente', 'Chofer', 'Camión', 'Cantidad', 'Estado', 'Codigo Postal', 'Direccion Acopio', 'Acciones'
  ];
  fecha!: Date;
  idCliente!: number;
  choferOriginal!: number;
  camionOriginal!: number;
  choferNuevo!: number;
  camionNuevo!: number;
  FormReasignar:FormGroup;
  mostrarFormularioReasignar: boolean = false;




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
      chofer: ['', Validators.required],
      camion: ['', Validators.required],
      fecha: [null, Validators.required],

    });
    this.completarAcopioForm = this.fb.group({
      monto_pagar: ['', Validators.required],
      cantidad: [0, Validators.required]
    });


    this.FormReasignar = this.fb.group({
      id: [null, Validators.required],
      chofer: [null, Validators.required],
      camion: [null, Validators.required]
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
      monto_pagar: ['', [Validators.required]],
      cantidad: [0, Validators.required]

    });

  }




  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  ngAfterViewChecked(): void {
    if (this.mapInitialized) {
      this.map.invalidateSize();
    }
  }



  isAdmin(): boolean {
    return this.authservice.isAdmin();
  }

  isChofer():boolean {
    return this.authservice.isChofer();
  }


  private initMap(): void {
    const mapElement = document.getElementById('map')!;
    this.map = L.map(mapElement).setView([37.0902, -95.7129], 4);
    // capa base OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.mapInitialized = true;
    this.actualizarPines();
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
      id_camion: null,
      Chofer: null,
      id_chofer: null,
      Estado: null,
      direccion: null,
      latitud: null,
      longitud: null,
      codigo_postal: null,
      Cantidad: null,

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
        this.map.invalidateSize();
        this.actualizarPines();
      }
    }, 0);
   }

    cerrarFormulario() {
      if (this.currentMarker) {
        this.currentMarker.remove();
        this.currentMarker = undefined;
      }

      this.map.setView([37.0902, -95.7129], 4);
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
            this.map.invalidateSize();
          }
        }, 0);
      }
    }


    obtenerCoordenadas(codigoPostal: string, ubicacionAcopio: string) {
      const direccion = `${ubicacionAcopio}, ${codigoPostal}`.trim();
      // URL absoluta apuntando al backend en el puerto 3300
      const url = `http://localhost:3300/api/geocode?address=${encodeURIComponent(direccion)}`;

      return this.http
        .get<{ lat: number; lng: number }>(url)
        .pipe(
          map(res => ({ lat: res.lat, lng: res.lng })),
          catchError(err => throwError(err))
        );
    }

      actualizarPines(): void {
        this.clearPins();
        if (this.acopiosFiltrados.length > 0) {
          this.acopiosFiltrados.forEach(acopio => this.agregarPin(acopio));
        } else {
          console.log('No hay acopios filtrados para mostrar.');
        }
      }

  clearPins(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }


  agregarPin(acopio: any) {
    if (!acopio) {
      console.log('No hay acopio disponible para agregar pin.');
      return;
    }

    console.log('Agregando pin para el acopio:', acopio);

    this.obtenerCoordenadas(acopio.codigo_postal, acopio.direccion).subscribe(
      coordenadas => {
        console.log('Coordenadas obtenidas:', coordenadas);
        const marker = L.marker([coordenadas.lat, coordenadas.lng])
        .addTo(this.map)
        .bindPopup(`
          <strong>Cliente:</strong> ${acopio.Cliente_Nombre}<br>
          <strong>Estado:</strong> ${acopio.EstadoTexto}<br>
          <strong>Chofer:</strong> ${acopio.Chofer_Nombre}<br>
          <strong>Camión:</strong> ${acopio.Camion_Identificador}<br>
          <strong>Dirección:</strong> ${acopio.direccion}<br>
          <strong>CP:</strong> ${acopio.codigo_postal}
        `);
         this.markers.push(marker);
      },
      error => {
        console.error('Error al obtener coordenadas:', error);
      }
    );
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
        this.currentMarker.remove();
        this.currentMarker = undefined;
      }
      return;
    }
    this.actualizarPin();
  }

  actualizarUbicacionAcopio(ubicacionAcopio: string) {
    this.nuevoAcopio.direccion = ubicacionAcopio;

    // si ya no hay dirección ni código postal, quita el marker
    if (!ubicacionAcopio && !this.nuevoAcopio.codigo_postal) {
      if (this.currentMarker) {
        this.currentMarker.remove();
        this.currentMarker = undefined;
        this.actualizarPin();
      }
      return;
    }
    this.actualizarCoordenadas();
  }


  actualizarCoordenadas() {
    this.obtenerCoordenadas(
      this.nuevoAcopio.codigo_postal,
      this.nuevoAcopio.direccion
    ).subscribe(coords => {
      this.nuevoAcopio.latitud = coords.lat;
      this.nuevoAcopio.longitud = coords.lng;
      if (this.currentMarker) {
        this.currentMarker.remove();
      }
      this.currentMarker = L.marker([coords.lat, coords.lng])
        .addTo(this.map)
        .bindPopup('Ubicación seleccionada');
        this.map.setView([coords.lat, coords.lng], 15);
    });
  }


  actualizarPin() {
    this.obtenerCoordenadas(this.nuevoAcopio.codigo_postal, this.nuevoAcopio.direccion)
      .subscribe(coords => {
        this.nuevoAcopio.latitud = coords.lat;
        this.nuevoAcopio.longitud = coords.lng;
        this.colocarCurrentMarker(coords);
      });
  }

  filtrarPorFecha() {
    if (this.filtroFecha) {
      const filtroFechaFormateada = this.convertirFechaAFormato(this.filtroFecha);
      console.log("Filtro Fecha:", filtroFechaFormateada);  // Verificar el formato del filtro

      this.acopiosFiltrados = this.acopios.filter(acopio => {
        const fechaAcopioFormateada = this.convertirFechaAFormato(acopio.Fecha);
        console.log("Fecha Acopio:", fechaAcopioFormateada);  // Verificar el formato de cada acopio
        return fechaAcopioFormateada === filtroFechaFormateada;
      });
    } else {
      this.acopiosFiltrados = [...this.acopios];
    }

    this.actualizarPines();
  }

  convertirFechaAFormato(fecha: any): string {
    const fechaObj = new Date(fecha);
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();

    return `${mes}-${dia}-${anio}`;
  }

 filtrarPorChofer() {
  if (this.filtroChofer) {
    const filtroChoferNum = parseInt(this.filtroChofer, 10);
    this.acopiosFiltrados = this.acopios.filter(acopio => acopio.chofer_id_chofer === filtroChoferNum);
  } else {
    this.acopiosFiltrados = [...this.acopios];
  }

  // Solo actualiza pines si hay acopios filtrados
  if (this.acopiosFiltrados.length > 0) {
    this.actualizarPines();
  }
}
  filtrarPorFechaYChofer() {
    const idChoferStr = this.authservice.getIdChofer();
    const idChofer = idChoferStr !== null ? +idChoferStr : -1;

    this.acopiosFiltrados = this.acopios.filter(acopio => {
      const fechaCumple = !this.filtroFecha || acopio.Fecha === this.filtroFecha;
      const choferCumple = idChofer < 0 || this.filtroChofer === null || acopio.chofer_id_chofer === parseInt(this.filtroChofer, 10);
      const estadoNumCumple = !this.filtroEstado || this.filtroEstado === '' || acopio.Estado === parseInt(this.filtroEstado, 10);

      return fechaCumple && choferCumple && estadoNumCumple;
    });

    if (this.acopiosFiltrados.length > 0) {
      this.actualizarPines();
    }
  }
  aplicarFiltro() {
    this.filtrarPorFechaYChofer();
    this.actualizarPines();
    if (this.acopiosFiltrados.length === 0) {
    }

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
    const fecha = this.programarAcopioForm.get('fecha')?.value;

    if (!fecha || !chofer || !camion) {
      alert('Debes completar todos los campos');
      return;
    }

    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];

    this.filtroFecha = fechaFormateada;
    this.filtroChofer = chofer;

    this.acopioService.inicializarAcopios(fechaFormateada, chofer, camion).subscribe(
      data => {
        this.obtenerAcopios();
        this.filtrarPorFechaYChofer();
      },
      error => {
        console.error('Error al inicializar acopios:', error);
      }
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
Imprimir() {
    const printSection = document.getElementById('print-section');
    const newWin = window.open('', '_blank', 'width=600,height=600');

    if (newWin) {
        newWin.document.write(`
            <html>
                <head>
                    <title>Imprimir Acopios</title>
                    <style>
                        @media print {
                            .no-print {
                                display: none !important; /* Ocultar elementos con la clase no-print */
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            th, td {
                                border: 1px solid black;
                                padding: 8px;
                                text-align: left;
                            }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div>${printSection?.innerHTML.replace(/<th mat-header-cell.*?acciones.*?<\/th>/, '').replace(/<td mat-cell.*?acciones.*?<\/td>/g, '')}</div>
                </body>
            </html>
        `);
        newWin.document.close();
    } else {
        console.error('No se pudo abrir la ventana de impresión.');
    }
}
  convertirEstado(estado: number): string {
    switch (estado) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'Realizado';
      case 2:
        return 'Anulado';
        case 3:
          return 'Reasignado';
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
      const { monto_pagar, cantidad } = this.completarAcopioForm.value;
      console.log('Cantidad en el formulario:', cantidad); // Verifica qué valor tiene cantidad
      const fecha = new Date().toISOString().split('T')[0];

      this.acopioService.completarAcopio(this.acopioSeleccionado.id_acopio, monto_pagar, fecha, cantidad).subscribe(
        response => {
          this.obtenerAcopios();
          this.mostrarFormularioCompletar = false;
        },
        error => {
          console.error('Error al completar acopio:', error);
        }
      );
    }
  }

  cerrarModal() {
    this.mostrarFormularioCompletar = false;
  }


private colocarCurrentMarker(coords: {lat:number,lng:number}) {
  if (this.currentMarker) this.currentMarker.remove();
  this.currentMarker = L.marker([coords.lat, coords.lng]).addTo(this.map);
  this.map.setView([coords.lat, coords.lng], 15);
}

formatFecha(): void {
  if (this.filtroFecha) {
    const date = new Date(this.filtroFecha);
    if (!isNaN(date.getTime())) {
      // Formatea como MM/DD/YYYY
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes con 2 dígitos
      const day = ('0' + date.getDate()).slice(-2); // Día con 2 dígitos
      const year = date.getFullYear();
      this.filtroFecha = `${month}/${day}/${year}`;
    }
  }
}

}
