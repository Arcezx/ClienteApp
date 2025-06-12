import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonBadge,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';

import { ReservaResponse } from 'src/app/models/reserva-response';
import { NgIf, DatePipe } from '@angular/common';

import { ReservaService } from '../../../services/reserva.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-confirmar-reserva',
  standalone: true,
  templateUrl: './confirmar-reserva.page.html',
  styleUrls: ['./confirmar-reserva.page.scss'],
  imports: [

    NgIf,
    DatePipe,

    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonBadge,
    IonButton,
    IonSpinner
  ],
})
export class ConfirmarReservaPage {

  vuelo   : any;         
  asiento : string = '';  
  cargando = false;      

  constructor(
    private router        : Router,
    private alertCtrl     : AlertController,
    private loadingCtrl   : LoadingController,
    private toastCtrl     : ToastController,
    private reservaSrv    : ReservaService,
    private authSrv       : AuthService
  ) {
    this.vuelo = this.router.getCurrentNavigation()?.extras?.state?.['vueloSeleccionado'];

    if (!this.vuelo) {
      this.router.navigate(['/home']);
      return;
    }

    this.generarAsientoDisponible();
  }

  private async generarAsientoDisponible() {
    const loading = await this.loadingCtrl.create({ message: 'Buscando asiento…' });
    await loading.present();

    try {
      const ocupados = await this.reservaSrv
        .obtenerAsientosOcupados(this.vuelo.id)
        .toPromise() ?? [];

      const filas   = 30;
      const letras  = ['A','B','C','D','E','F'];

      let candidato = '';
      do {
        const fila  = Math.floor(Math.random() * filas) + 1;
        const letra = letras[Math.floor(Math.random() * letras.length)];
        candidato   = `${fila}${letra}`;
      } while (ocupados.includes(candidato));

      this.asiento = candidato;

    } catch (err) {
      console.error('Error generando asiento', err);
      this.asiento = '--';
    } finally {
      await loading.dismiss();
    }
  }

async confirmarReserva() {
  const confirm = await this.alertCtrl.create({
    header: 'Confirmar Reserva',
    message: '¿Estás seguro que deseas reservar este vuelo?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Reservar',
        handler: async () => {
          await this.realizarReserva();
        }
      }
    ]
  });
  await confirm.present();
}

private async realizarReserva() {
  this.cargando = true;
  try {
    const idUsuario = this.authSrv.getIdUsuario();
    if (!idUsuario) {
      await this.mostrarToast('Debes iniciar sesión', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    const respuesta = await this.reservaSrv
      .crearReservaApp(this.vuelo.id, idUsuario)
      .toPromise() as ReservaResponse | undefined;

    await this.mostrarToast(
      respuesta?.message ?? 'Reserva creada', 'success'
    );

    await this.mostrarAlertaExito(respuesta?.data);
    this.router.navigate(['/reservas']);

  } catch (err: any) {
    console.error(err);
    await this.mostrarToast(
      err?.error?.message || 'Error al crear la reserva',
      'danger'
    );
  } finally {
    this.cargando = false;
  }
}

private async mostrarAlertaExito(reservaCreada: any) {
  const alert = await this.alertCtrl.create({
    header: '✈️ ¡Reserva confirmada!',
    message: `
    Tu reserva se ha confirmado con exito.
    `,
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'Ver reserva',
        handler: () => {
          this.router.navigate(['/reservas']);
        }
      },
      'Aceptar'
    ]
  });

  await alert.present();
}

  private async mostrarToast(msg: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message : msg,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

}
