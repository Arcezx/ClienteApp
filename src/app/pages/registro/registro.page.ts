import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular/standalone';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class RegistroPage {
  registroForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    public router: Router,
    
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      tipo: ['ESTANDAR'] 
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }
async registrar() {
  if (this.registroForm.invalid) {
    return;
  }

  this.cargando = true;
  const loading = await this.loadingCtrl.create({
    message: 'Registrando...'
  });
  await loading.present();

  try {
    const { confirmPassword, ...userData } = this.registroForm.value;
    await this.clienteService.registrarClienteMovil(userData);
    
    await loading.dismiss();
    await this.mostrarAlerta('¡Registro exitoso!', 'Ahora puedes iniciar sesión');
    this.router.navigate(['/login']);
  } catch (error: any) {
    await loading.dismiss();
    const errorMsg = error.error?.message || error.message || 'Ocurrió un error al registrarse';
    await this.mostrarAlerta('Error', errorMsg);
  } finally {
    this.cargando = false;
  }
}

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}