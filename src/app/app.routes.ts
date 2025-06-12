import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PremiumGuard } from './guards/premium.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard] 
  },
  {
    path: 'vuelos',
    loadComponent: () => import('./pages/vuelos/vuelos.page').then(m => m.VuelosPage),
    canActivate: [AuthGuard] 
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [AuthGuard] 
  },
{
  path: 'reservas',
  loadComponent: () => import('./pages/reservas/reservas.page').then(m => m.ReservasPage),
  canActivate: [AuthGuard]
},

  {
  path: 'confirmar-reserva',
  loadComponent: () => import('./pages/reservas/confirmar-reserva/confirmar-reserva.page').then(m => m.ConfirmarReservaPage),
  canActivate: [AuthGuard]
},
  {
    path: '**',
    redirectTo: 'home'
  }
];