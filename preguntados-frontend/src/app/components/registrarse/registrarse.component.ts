import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {

  registerForm!: FormGroup;
  cargando: boolean = false;
  step: number = 1;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    // private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({

      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],

      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required],

      tipoDocumento: ['1', Validators.required],
      numeroDocumento: ['', Validators.required],

      calle: ['', Validators.required],
      numero: ['', Validators.required],
      localidad: ['', Validators.required],
      provincia: ['', Validators.required],

      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });
  }


  nextStep(): void {
    if (!this.validarPaso1()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Completá los datos personales antes de continuar'
      });
      return;
    }

    this.step = 2;
  }

  prevStep(): void {
    this.step = 1;
  }


  validarPaso1(): boolean {
    const camposPaso1 = [
      'nombre',
      'apellido',
      'sexo',
      'tipoDocumento',
      'numeroDocumento',
      'calle',
      'numero',
      'localidad',
      'provincia',
      'telefono',
      'correoElectronico'
    ];

    this.marcarCamposComoTocados(camposPaso1);

    return camposPaso1.every(campo => this.registerForm.get(campo)?.valid);
  }

  validarPaso2(): boolean {
    const camposPaso2 = ['username', 'password', 'repeatPassword'];

    this.marcarCamposComoTocados(camposPaso2);

    const validos = camposPaso2.every(campo => this.registerForm.get(campo)?.valid);

    if (!validos) return false;

    if (this.passwordsNoCoinciden()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden'
      });
      return false;
    }

    return true;
  }

  marcarCamposComoTocados(campos: string[]): void {
    campos.forEach(campo => {
      this.registerForm.get(campo)?.markAsTouched();
    });
  }

  passwordsNoCoinciden(): boolean {
    const pass = this.registerForm.get('password')?.value;
    const repeat = this.registerForm.get('repeatPassword')?.value;

    return pass && repeat && pass !== repeat;
  }


  register(): void {

    if (!this.validarPaso2()) {
      return;
    }

    this.cargando = true;

    const form = this.registerForm.value;

    const payload = {
      metodo: "registrarNuevoUsuario",
      usuario: {
        username: form.username,
        contrasenia: form.password,
        id_rol: 1
      },
      datosPersonales: {
        nombre: form.nombre,
        apellido: form.apellido,
        sexo: form.sexo,
        documento: {
          numero: form.numeroDocumento,
          tipo: parseInt(form.tipoDocumento)
        },
        domicilio: {
          calle: form.calle,
          numero: form.numero,
          localidad: form.localidad,
          provincia: form.provincia
        },
        telefono: form.telefono,
        correoElectronico: form.correoElectronico
      }
    };

    console.log(payload);

    /*
    this.authService.register(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Ya podés iniciar sesión'
        });

        this.router.navigate(['/login']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el usuario'
        });
        this.cargando = false;
      }
    });
    */

    // Simulación
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Usuario creado correctamente'
      });

      this.router.navigate(['/login']);
      this.cargando = false;
    }, 1000);
  }
}