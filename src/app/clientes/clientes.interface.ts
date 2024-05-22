export interface Cliente {
    id_cliente:number;
    Email: string;
    Nombre: string;
    Dni:string;
    Telefono: string;
    Codigo_postal:string;
    Region:string;
    Direccion:string;
    Nombre_contacto:string;
    Telefono_contacto:string;
    Fecha_ultima_visita:Date;
    Intervalo_de_visita:number;
    Latitud:number;
    Longitud:number;
    Fecha_creacion:Date | null;
    Fecha_modificacion:Date | null;
    Estado:number;
    
}