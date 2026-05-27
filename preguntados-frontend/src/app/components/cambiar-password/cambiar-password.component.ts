import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import jwtDecode from 'jwt-decode';

interface JwtPayload {
  sub: number;
  exp: number;
}

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {

  passwordForm!: FormGroup;
  cargando: boolean = false;

  message: string = '';
  errorMessage: string = '';
  private alertTimeout: any;

  idUsuario!: number;

  passwordCambiada: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const userId = this.getUserId();

    if (!userId) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.idUsuario = userId;

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator]],
      repeatPassword: ['', Validators.required]
    });
  }

  passwordValidator(control: any) {
    const value = control.value;

    if (!value) return null;

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    return regex.test(value) ? null : { weakPassword: true };
  }

  passwordsNoCoinciden(): boolean {
    return this.passwordForm.value.password !== this.passwordForm.value.repeatPassword;
  }

  cambiarPassword(): void {

    if (this.passwordCambiada) return;

    if (this.passwordForm.invalid || this.passwordsNoCoinciden() || this.cargando) {
      this.showError('Revisá los datos ingresados');
      return;
    }

    this.cargando = true;

    const password = this.passwordForm.value.password;

    this.authService.actualizarConstrasenia(this.idUsuario, password).subscribe({
      next: (response: any) => {
        this.cargando = false;

        if (response.success) {

          this.passwordCambiada = true;

          this.passwordForm.disable();

          sessionStorage.clear();

          this.showMessageAndRedirect('Contraseña actualizada correctamente');

        } else {
          this.showError(response.message);
        }
      },
      error: (err: any) => {
        this.cargando = false;

        this.showError(
          err?.error?.message || 'Error al cambiar la contraseña'
        );
      }
    });
  }

  getToken(): string | null {
    return sessionStorage.getItem('tmp_token');
  }

  getUserId(): number | null {
    const token = this.getToken();

    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) return null;

      return decoded.sub;
    } catch (e) {
      return null;
    }
  }

  private showMessageAndRedirect(message: string) {
    this.message = message;

    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.router.navigate(['/iniciar-sesion']);
    }, 3000);
  }

  private showError(message: string) {
    this.errorMessage = message;

    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}