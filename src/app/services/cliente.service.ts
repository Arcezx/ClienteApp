import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiBaseUrl}/api/clientes`;

  constructor(private http: HttpClient) {}

   async registrarClienteMovil(clienteData: {nombre: string, email: string, password: string}) {
    const payload = {
      nombre: clienteData.nombre,
      email: clienteData.email,
      password: clienteData.password,
      tipo: 'ESTANDAR', 
      estado: 'ACTIVO'  
    };
   try {
    const response$ = this.http.post(this.apiUrl, payload);
    return await lastValueFrom(response$);
  } catch (error) {
      console.error('Error al registrar cliente:', error);
      throw error;
    }
  }
}