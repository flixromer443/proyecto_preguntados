import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.idUsuario = Number(params['id_usuario']);
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator]],
      repeatPassword: ['', Validators.required]
    });
  }

  // =========================
  // VALIDADOR PASSWORD
  // =========================
  passwordValidator(control: any) {
    const value = control.value;

    if (!value) return null;

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    return regex.test(value) ? null : { weakPassword: true };
  }

  passwordsNoCoinciden(): boolean {
    return this.passwordForm.value.password !== this.passwordForm.value.repeatPassword;
  }

  // =========================
  // CAMBIAR PASSWORD
  // =========================
  cambiarPassword(): void {

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

  // =========================
  // ALERTS
  // =========================
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