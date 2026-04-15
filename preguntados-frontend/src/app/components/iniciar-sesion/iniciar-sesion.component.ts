import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { AuthService } from '../../services/auth.service'; // <- lo vas a crear

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {

  loginForm!: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    // private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor complete todos los campos'
      });
      return;
    }

    this.cargando = true;

    const { usuario, password } = this.loginForm.value;

    // 🔥 Acá después conectás con backend
    /*
    this.authService.login(usuario, password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        this.messageService.add({
          severity: 'success',
          summary: 'Login exitoso',
          detail: 'Bienvenido'
        });

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas'
        });
        this.cargando = false;
      }
    });
    */

    // Simulación temporal
    setTimeout(() => {
      if (usuario === 'admin' && password === '1234') {
        this.messageService.add({
          severity: 'success',
          summary: 'Login exitoso',
          detail: 'Bienvenido'
        });
        this.router.navigate(['/home']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas'
        });
      }
      this.cargando = false;
    }, 1000);
  }
}