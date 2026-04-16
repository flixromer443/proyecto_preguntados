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

  // 🔥 NUEVO ALERT
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
        if(response.success){
          sessionStorage.setItem('usuario', JSON.stringify(response.data.usuario));
          sessionStorage.setItem('token', response.data.token);

          this.messageService.add({
            severity: 'success',
            summary: 'Login exitoso',
            detail: 'Bienvenido'
          });

          this.router.navigate(['/perfil-jugador']);
          this.cargando = false;
        }else{
            this.showError(response.message);
            this.cargando = false;
        }
      },
      error: (err: any) => {
        this.showError(
          err?.error?.message || 'Credenciales incorrectas'
        );
        this.cargando = false;
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