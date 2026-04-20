import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {

  loginForm!: FormGroup;
  cargando: boolean = false;

  errorMessage: string = '';
  private alertTimeout: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {

    if (this.loginForm.invalid) {
      this.showError('Por favor complete todos los campos');
      return;
    }

    this.cargando = true;

    const { usuario, password } = this.loginForm.value;

    this.authService.iniciarSesion(usuario, password).subscribe({

      next: (response: any) => {

        this.cargando = false;

        if (response.success && response.code == 202) { //usuario activo
          sessionStorage.setItem('token', response.data.token);
          this.router.navigate(['/perfil-jugador']);
        }

        else if (response.success && response.code == 206) { //usuario inactivo
          this.router.navigate(['/ingresar-codigo'], {
            queryParams: {
              id_usuario: response.data.id_usuario,
              accion: response.data.accion
            }
          });
        }

        else {
          this.showError(response.message || 'Credenciales incorrectas');
        }
      },

      error: (err: any) => {
        this.cargando = false;

        this.showError(
          err?.error?.message || 'Error de conexión con el servidor'
        );

        console.log(err);
      }
    });
  }

  private showError(message: string) {
    this.errorMessage = message;

    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}