export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  password?: string;
  tipo: 'estandar' | 'premiun';
  reservas?: string[]; 
}