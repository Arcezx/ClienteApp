import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
export interface LoginResponse {
  idUsuario: number;
  nombre:     string;
  tipoUsuario: string;
  estado:     string;
  email:      string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/api/app/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  /* ---------- sesión ---------- */

login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }, {
    withCredentials: true,
    observe: 'response' // Importante para ver headers
  }).pipe(
    tap(response => {
      const res = response.body;
      if (res) {
        localStorage.setItem('currentUser', JSON.stringify(res));
        localStorage.setItem('idUsuario', String(res.idUsuario));
      }

      // Captura de cookie
      const setCookie = response.headers.get('Set-Cookie');
      if (setCookie) {
        const jsessionId = setCookie.split(';')[0]; // Extrae "JSESSIONID=..."
        localStorage.setItem('JSESSIONID', jsessionId);
      }
    }),
    map(response => response.body!)
  );
}

    authenticatedGet(url: string): Observable<any> {
    return this.http.get(url, {
      withCredentials: true
    });
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('idUsuario');
    this.router.navigate(['/login']);
  }


getIdUsuario(): number | null {
  const u = this.getCurrentUser();
  return u ? u.idUsuario : null;
}

  getCurrentUser(): LoginResponse | null {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) as LoginResponse : null;
  }

  obtenerIdUsuario(): number | null {
    const raw = localStorage.getItem('idUsuario');
    return raw ? Number(raw) : null;
  }

  isLoggedIn(): boolean {
    return this.obtenerIdUsuario() !== null;
  }

  esPremium(): boolean {
    return this.getCurrentUser()?.tipoUsuario === 'PREMIUM';
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.tipoUsuario ?? null;
  }
}
