export interface Reserva {
  id: number;
  origen: string;
  destino: string;
  fecha: string;     
  hora: string;     
  codigo: string;    
  estado: string;    
  nombreUsuario?: string;
  idReserva: number;
  idVuelo: number;
  fechaVuelo: string;
  asiento: string;
  message: string;

}
