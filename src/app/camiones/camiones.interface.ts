export interface Camion {
    id_camion:number;
    Identificador: string;
    Matricula:string;
    Marca:string;
    Modelo:string;
    Fecha_creacion:Date | null;
    Fecha_modificacion:Date | null;
}