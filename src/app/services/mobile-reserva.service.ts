import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileReservaService {
  private baseUrl = `${environment.apiBaseUrl}/api/mobile/reservas`;

  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${userId}`);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/cancelar`, {});
  }
}