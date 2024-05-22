export interface Chofer {
    id_chofer:number;
    Nombre: string;
    Dni:string;
    Region:string;
    Codigo_postal:string;
    Direccion:string;
    Telefono: string;
    Fecha_creacion:Date | null;
    Fecha_modificacion:Date | null;
    Estado:number;
    
}