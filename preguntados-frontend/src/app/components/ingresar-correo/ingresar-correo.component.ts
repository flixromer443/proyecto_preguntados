import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ingresar-correo',
  templateUrl: './ingresar-correo.component.html',
  styleUrls: ['./ingresar-correo.component.css']
})
export class IngresarCorreoComponent implements OnInit {

  emailForm!: FormGroup;
  cargando: boolean = false;

  message: string = '';
  errorMessage: string = '';
  private alertTimeout: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarCodigo(): void {

    if (this.emailForm.invalid || this.cargando) {
      this.showError('Ingresá un correo válido');
      return;
    }

    this.cargando = true;

    const email = this.emailForm.value.email;

    this.authService.solicitarCambioDeContrasenia(email).subscribe({
      next: (response: any) => {
        this.cargando = false;

        if (response.success) {

          this.showMessage('Se envió un código a tu correo');

          setTimeout(() => {
            this.router.navigate(['/ingresar-codigo'], {
              queryParams: {
                id_usuario: response.id_usuario,
                accion: 2 
              }
            });
          }, 1500);

        } else {
          this.showError(response.message);
        }
      },
      error: (err: any) => {
        this.cargando = false;

        this.showError(
          err?.error?.message || 'Error al enviar el código'
        );
      }
    });
  }

  private showMessage(message: string) {
    this.message = message;
    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}