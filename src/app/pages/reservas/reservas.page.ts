import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Importa Location desde @angular/common

import { 
  ToastController, 
  LoadingController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
  IonButtons
} from '@ionic/angular/standalone';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../models/reserva';
import { lastValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { 
  airplaneOutline, 
  calendarOutline, 
  timeOutline, 
  arrowBackOutline,
  trashOutline,
  searchOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    IonSpinner,
    IonButtons
  ]
})
export class ReservasPage implements OnInit {
  reservas: any[] = [];
  cargando: boolean = true;
  idUsuario: number | null = null;

  constructor(
    public router: Router, 
    private reservaSrv: ReservaService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private location: Location, 

  ) {
    addIcons({ 
      airplaneOutline, 
      calendarOutline, 
      timeOutline, 
      arrowBackOutline,
      trashOutline,
      searchOutline
    });
  }

  async ngOnInit() {
    await this.cargarReservas();
  }

  async cargarReservas() {
    this.cargando = true;
    try {
      this.idUsuario = this.authService.obtenerIdUsuario();
      
      if (!this.idUsuario) {
        await this.mostrarToast('Debes iniciar sesión', 'danger');
        this.router.navigate(['/login']);
        return;
      }

      const reservas$ = this.reservaSrv.obtenerReservasPorUsuario(this.idUsuario);
      this.reservas = await lastValueFrom(reservas$);
      
    } catch (error) {
      console.error('Error cargando reservas:', error);
      await this.mostrarToast('Error al cargar reservas', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  async confirmarReserva(vuelo: any) {
    if (!this.idUsuario) {
      await this.mostrarToast('Debes iniciar sesión para reservar', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    if (!vuelo?.id) {
      await this.mostrarToast('No se ha seleccionado ningún vuelo', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando reserva...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const reserva$ = this.reservaSrv.crearReservaApp(vuelo.id, this.idUsuario!);
      const respuesta = await lastValueFrom(reserva$);

      await this.mostrarToast(respuesta?.message || 'Reserva creada exitosamente', 'success');
      await this.cargarReservas();
      
    } catch (error: any) {
      console.error('Error al reservar:', error);
      const errorMsg = error?.error?.message || 'Error al crear la reserva';
      await this.mostrarToast(errorMsg, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async mostrarToast(message: string, color: 'success' | 'danger' | 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  formatFecha(fechaString: string): string {
    if (!fechaString) return 'Fecha no definida';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return fechaString;
    }
  }
goBack() {
  this.router.navigate(['/home'], { replaceUrl: true });
}
}