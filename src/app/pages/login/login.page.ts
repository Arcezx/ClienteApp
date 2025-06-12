import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  cargando = false;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.loginForm.valid) {
      this.cargando = true;
      console.log('Enviando:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            console.log('Respuesta:', response);
            this.cargando = false;
            if (response.tipoUsuario === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (error) => {
            console.error('Error:', error);
            this.cargando = false;
            this.snackBar.open(error.error?.message || 'Error al iniciar sesión', 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          },
          complete: () => {
            console.log('Petición completada');
            this.cargando = false;
          }
        });
    }
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  recuperarContrasena() {
    this.router.navigate(['/recuperar-contrasena']);
  }
}