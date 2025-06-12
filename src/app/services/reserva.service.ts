import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reserva } from '../models/reserva';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs';
import { map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Viaje } from '../models/viaje';
export interface ReservaResponse {
  message: string;
    data?:   any;        

}

@Injectable({ providedIn: 'root' })
export class ReservaService {

  private apiUrl = `${environment.apiBaseUrl}/api/reservas`;
  private reservasSubject = new BehaviorSubject<Reserva[]>([]);
  reservas$ = this.reservasSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService        
  ) {}

  obtenerReservaDelUsuario(): Observable<Reserva | null> {
    const id = this.auth.getIdUsuario();
    if (!id) {                            
      return of(null);
    }

    return this.http
      .get<Reserva>(
        `${environment.apiBaseUrl}/api/reservas/usuario/actual`,
        { params: { idUsuario: id },
        withCredentials: true
      }
      )
      .pipe(
        catchError(err => {             
          console.warn('Sin reserva actual', err);
          return of(null);
        })
      );
  }

  obtenerReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl).pipe(
      tap(r => this.reservasSubject.next(r)),
      catchError(err => { console.error(err); return of([]); })
    );
  }

  obtenerReservasPorUsuario(id: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/usuario/${id}`).pipe(
      tap(r => this.reservasSubject.next(r)),
      catchError(err => { console.error(err); return of([]); })
    );
  }

obtenerAsientosOcupados(idViaje: number): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/ocupados/${idViaje}`)
    .pipe(catchError(err => {
      console.error('Error asientos ocupados:', err);
      return of([]);         
    }));
} 

  cancelarReserva(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

crearReservaApp(idVuelo: number, idUsuario: number): Observable<ReservaResponse> {
  return this.http.post<ReservaResponse>(
    `${this.apiUrl}/app/crear`,
    { idViaje: idVuelo, idUsuario }  
  ).pipe(
    catchError(error => {
      console.error('Error al crear reserva:', error);
      throw error;
    })
  );
}

  actualizarAsiento(id: number, asiento: string) {
    return this.http.put(`${this.apiUrl}/asiento/${id}`, { asiento });
  }

crearReserva(reservaData: any): Observable<Reserva> {
  return this.http.post<Reserva>(`${this.apiUrl}/crear`, reservaData).pipe(
    tap((nuevaReserva) => {
      const reservasActuales = this.reservasSubject.value;
      this.reservasSubject.next([...reservasActuales, nuevaReserva]);
    })
  );
}

   obtenerReservasUsuario(idUsuario: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/usuario/${idUsuario}`).pipe(
      tap(reservas => this.reservasSubject.next(reservas)),
      catchError(err => {
        console.error('Error obteniendo reservas:', err);
        return of([]);
      })
    );
  }

    obtenerReservaActual(): Observable<Reserva | null> {
    const id = this.auth.getIdUsuario();
    if (!id) return of(null);
    
    return this.http.get<Reserva>(`${this.apiUrl}/usuario/actual`, {
      params: { idUsuario: id }
    }).pipe(
      catchError(() => of(null))
    );
  }

  
  obtenerReservasConVuelosPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/reservas/usuario/${idUsuario}`).pipe(
      switchMap(reservas => {
        const requests = reservas.map(reserva => 
          this.http.get<Viaje>(`${this.apiUrl}/vuelos/${reserva.idVuelo}`).pipe(
            map(vuelo => ({
              ...reserva,
              fechaVuelo: vuelo.fechaSalida,
              horaVuelo: vuelo.horaSalida
            }))
          ))
        return forkJoin(requests);
      })
    );
  }
}
