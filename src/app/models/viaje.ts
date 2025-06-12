export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fechaSalida: string;
  fechaRegreso?: string;
  horaSalida: string;
  horaRegreso?: string;
  precio: number;
  duracion: string;
  clase: string;
  tipo: string;
  capacidad: number;
  estado: string;
}