import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReservaService } from '../../services/reserva.service';
import { ViajeService } from '../../services/viaje.service';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../models/reserva';
import { LoadingController, ToastController } from '@ionic/angular';
import { Viaje } from '../../models/viaje';

@Component({
  selector: 'app-home',
  standalone: true,
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  nombreUsuario = '';
  tieneReserva = false;
  reserva!: Reserva;
  mostrarSelectorFechas = false;
  fechasSeleccionadas: string[] = [];
  fechaHoy = new Date().toISOString();
  fechaMaxima = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

  mostrarModalDestino = false;
  destinoSeleccionado: any = null;

  busqueda = {
    origen: '',
    destino: '',
    fechaInicio: '',
    fechaFin: ''
  };

  destinosPopulares = [
    { 
      nombre: 'Roma', 
      imagen: 'assets/destinos/roma.jpg',
      descripcion: 'La Ciudad Eterna, hogar del Coliseo, el Vaticano y la deliciosa pasta italiana. Explora más de 2,500 años de historia en cada esquina.',
      atracciones: 'Coliseo, Vaticano, Fontana di Trevi'
    },
    { 
      nombre: 'Tokio', 
      imagen: 'assets/destinos/tokio.jpg',
      descripcion: 'Una mezcla fascinante de tradición y futurismo. Desde los templos antiguos hasta el cruce de Shibuya, Tokio nunca deja de sorprender.',
      atracciones: 'Shibuya Crossing, Torre de Tokio, Templo Senso-ji'
    },
    { 
      nombre: 'Nueva York', 
      imagen: 'assets/destinos/nueva_york.jpg',
      descripcion: 'La ciudad que nunca duerme, famosa por Times Square, Central Park y la Estatua de la Libertad. ¡Experimenta la energía de la Gran Manzana!',
      atracciones: 'Times Square, Central Park, Estatua de la Libertad'
    },
    { 
      nombre: 'París', 
      imagen: 'assets/destinos/paris.jpg',
      descripcion: 'La Ciudad de la Luz, romántica y llena de historia. No te pierdas la Torre Eiffel, el Louvre y los encantadores cafés parisinos.',
      atracciones: 'Torre Eiffel, Louvre, Arco del Triunfo'
    },
    { 
      nombre: 'Bogotá', 
      imagen: 'assets/destinos/bogota.jpg',
      descripcion: 'La capital de Colombia, una mezcla de cultura, historia y modernidad. Disfruta de su gastronomía, museos y la vibrante vida nocturna.',
      atracciones: 'Museo del Oro, Monserrate, La Candelaria'
    }
  ];

  constructor(
    private router: Router,
    private reservaSrv: ReservaService,
    private viajesSrv: ViajeService,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit(): void {
    this.nombreUsuario = this.auth.getCurrentUser()?.nombre ?? 'Usuario';

    this.reservaSrv.obtenerReservaDelUsuario().subscribe(res => {
      if (res) { 
        this.tieneReserva = true; 
        this.reserva = res; 
      } else { 
        this.tieneReserva = false; 
      }
    });
  }

  abrirSelectorFechas() {
    this.fechasSeleccionadas = [];
    if (this.busqueda.fechaInicio) {
      this.fechasSeleccionadas.push(this.busqueda.fechaInicio);
    }
    if (this.busqueda.fechaFin) {
      this.fechasSeleccionadas.push(this.busqueda.fechaFin);
    }
    this.mostrarSelectorFechas = true;
  }

  seleccionarRangoFechas() {
    if (this.fechasSeleccionadas.length === 2) {
      const fechasOrdenadas = [...this.fechasSeleccionadas].sort();
      this.busqueda.fechaInicio = fechasOrdenadas[0];
      this.busqueda.fechaFin = fechasOrdenadas[1];
    }
  }

  getFechaTexto(): string {
    if (this.busqueda.fechaInicio && this.busqueda.fechaFin) {
      const inicio = new Date(this.busqueda.fechaInicio);
      const fin = new Date(this.busqueda.fechaFin);
      return `${inicio.toLocaleDateString('es', {day: 'numeric', month: 'short'})} - ${fin.toLocaleDateString('es', {day: 'numeric', month: 'short'})}`;
    }
    return 'Seleccionar fechas';
  }

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  }

  getAtraccionesArray(atracciones: string): string[] {
    if (!atracciones) return [];
    return atracciones.split(',').map(a => a.trim());
  }

  async buscarVuelos() {
    const idUsuario = this.auth.obtenerIdUsuario();
    if (!idUsuario) {
      const toast = await this.toastCtrl.create({
        message: 'Debes iniciar sesión para buscar vuelos',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (!this.busqueda.fechaInicio || !this.busqueda.fechaFin) {
      const toast = await this.toastCtrl.create({
        message: 'Debes seleccionar un rango de fechas',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const fechaInicio = new Date(this.busqueda.fechaInicio);
    const fechaFin = new Date(this.busqueda.fechaFin);

    if (fechaFin < fechaInicio) {
      const toast = await this.toastCtrl.create({
        message: 'La fecha final no puede ser anterior a la fecha inicial',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Buscando vuelos...',
    });
    await loading.present();

    try {
      const respuesta = await this.viajesSrv.buscarVuelosCompletos(
        this.busqueda.origen.trim(),
        this.busqueda.destino.trim(),
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        idUsuario
      ).toPromise();

      if (respuesta?.vuelos?.length > 0) {
        await this.router.navigate(['/vuelos'], {
          state: {
            resultados: respuesta.vuelos,
            tipo: respuesta.tipo,
            mensaje: respuesta.mensaje,
            criterios: this.busqueda
          }
        });
      } else {
        const toast = await this.toastCtrl.create({
          message: respuesta?.mensaje || 'No se encontraron vuelos',
          duration: 3000,
          color: 'warning'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al conectar con el servidor',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  abrirModalDestino(destino: any) {
    this.destinoSeleccionado = destino;
    this.mostrarModalDestino = true;
  }

  cerrarModalDestino() {
    this.mostrarModalDestino = false;
  }

  async buscarVuelosADestino() {
    if (!this.destinoSeleccionado) return;

    const idUsuario = this.auth.obtenerIdUsuario();
    if (!idUsuario) {
      const toast = await this.toastCtrl.create({
        message: 'Debes iniciar sesión para buscar vuelos',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ 
      message: 'Buscando vuelos...',
    });
    await loading.present();

    try {
      const vuelos = await this.viajesSrv.buscarPorDestino(
        this.destinoSeleccionado.nombre, 
        idUsuario
      ).toPromise();

      if (vuelos && vuelos.length > 0) {
        await this.router.navigate(['/vuelos'], {
          state: {
            resultados: vuelos,
            tipo: 'alternativos',
            mensaje: `Vuelos disponibles a ${this.destinoSeleccionado.nombre}`,
            criterios: { 
              origen: '', 
              destino: this.destinoSeleccionado.nombre 
            }
          }
        });
      } else {
        const toast = await this.toastCtrl.create({
          message: `No hay vuelos disponibles a ${this.destinoSeleccionado.nombre}`,
          duration: 3000,
          color: 'warning'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al conectar con el servidor',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
      this.cerrarModalDestino();
    }
  }

  regresar() {
    this.router.navigate(['/inicio']);
  }

  private async mostrarMensaje(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  navigateTo(path: string) { 
    this.router.navigate([path]); 
  }
}