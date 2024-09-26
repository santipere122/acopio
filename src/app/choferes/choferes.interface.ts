export interface Chofer {
    id_chofer:number;
    id_camion:number;
    Nombre: string;
    Dni:string;
    Region:string;
    Codigo_postal:string;
    Direccion:string;
    Telefono: string;
    Fecha_creacion:Date | null;
    Fecha_modificacion:Date | null;
    Estado: 0 | 1;
    
}