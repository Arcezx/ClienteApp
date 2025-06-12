import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.page.html',
  styleUrls: ['./vuelos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class VuelosPage implements OnInit {
  vuelos: any[] = [];
  tipoBusqueda: string = '';
  mensaje: string = '';
  criterios: any = {};

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.vuelos = state['resultados'] || [];
      this.tipoBusqueda = state['tipo'] || '';
      this.mensaje = state['mensaje'] || '';
      this.criterios = state['criterios'] || {};
    }
  }
  ngOnInit() {}

reservar(vuelo: any) {
  this.router.navigate(['/confirmar-reserva'], { 
    state: { vueloSeleccionado: vuelo } 
  });
}
    navegarAHome() {
    this.router.navigate(['/home']);
  }
}
