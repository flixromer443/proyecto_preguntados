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

  register(): void {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor complete todos los campos'
      });
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

    // 🔥 Conexión real (cuando tengas el service)
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
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el usuario'
        });
        this.cargando = false;
      }
    });
    */

    // Simulación temporal
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