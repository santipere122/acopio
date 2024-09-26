export interface Usuario {
  id_Usuario: number;
  Usuario: string;
  Password: string;
  Fecha_Creacion: string;
  Fecha_Modificacion: string;
  Estado: string;
  id_chofer: number | null;
  Rol: string;
}

export interface UsuarioCreacion {
  Usuario: string;
  Password: string;
  id_chofer?: number | null; 
  Rol?: string;       
}