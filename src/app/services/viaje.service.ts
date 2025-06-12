import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Viaje } from '../models/viaje';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private apiUrl = `${environment.apiBaseUrl}/api/viajes`;

  constructor(private http: HttpClient) {}

  obtenerViaje(idViaje: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idViaje}`).pipe(
      catchError(error => {
        console.error('Error al obtener viaje:', error);
        return of(null);
      })
    );
  }

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener todos los viajes:', error);
        return of([]);
      })
    );
  }
  buscarEntreFechas(
    origen: string,
    destino: string,
    fechaInicio: string,
    fechaFin:    string,
    idUsuario:   number
  ) {
    return this.http.get<Viaje[]>(`${this.apiUrl}/busqueda`, {
      params: { origen, destino, fechaInicio, fechaFin, idUsuario }
    });
  }
  buscarViajes(origen: string, destino: string, idUsuario: number): Observable<any[]> {
    const params = new HttpParams()
      .set('origen', origen)
      .set('destino', destino)
      .set('idUsuario', idUsuario.toString());

    return this.http.get<any[]>(`${this.apiUrl}/buscar`, { params });
  }

buscarVuelosCompletos(
  origen: string,
  destino: string,
  fechaInicio: string,
  fechaFin: string,
  idUsuario: number
): Observable<any> {
  const fechaInicioFormatted = fechaInicio.split('T')[0];
  const fechaFinFormatted = fechaFin.split('T')[0];

  return this.http.get(`${this.apiUrl}/busqueda-completa`, {
    params: {
      origen,
      destino,
      fechaInicio: fechaInicioFormatted,
      fechaFin: fechaFinFormatted,
      idUsuario: idUsuario.toString()
    }
  }).pipe(
    catchError(error => {
      console.error('Error al buscar vuelos:', error);
      return of({ 
        tipo: 'error', 
        mensaje: 'Error al buscar vuelos',
        vuelos: []
      });
    })
  );
}

buscarPorDestino(destino: string, idUsuario: number): Observable<Viaje[]> {
  console.log(`[ViajeService] Buscando vuelos a ${destino} para usuario ${idUsuario}`);
  
  return this.http.get<Viaje[]>(`${this.apiUrl}/por-destino`, {
    params: { 
      destino: destino.trim(), 
      idUsuario: idUsuario.toString() 
    }
  }).pipe(
    tap(vuelos => console.log(`[ViajeService] Vuelos recibidos:`, vuelos)),
    catchError(err => {
      console.error('[ViajeService] Error en /por-destino:', err);
      return of([]);
    })
  );
}


}
