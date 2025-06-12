import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsientoService {
  private apiUrl = `${environment.apiBaseUrl}/api/asientos`;

  constructor(private http: HttpClient) {}

  obtenerAsientosPorVuelo(idVuelo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vuelo/${idVuelo}`).pipe(
      catchError(error => {
        console.error('Error al obtener asientos del vuelo:', error);
        return of([]);
      })
    );
  }
}
