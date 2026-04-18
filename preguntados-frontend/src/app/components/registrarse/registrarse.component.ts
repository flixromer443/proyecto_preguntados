import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Provincia, Departamento, Localidad } from '../../models/georef.interfaces';
import { GeorefService } from '../../services/georef.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {

  registerForm!: FormGroup;
  cargando: boolean = false;
  step: number = 1;

  provincias: Provincia[] = [];
  departamentos: Departamento[] = [];
  localidades: Localidad[] = [];

  callesFiltradas: any[] = [];
  calleSeleccionada: any = null;
  alturaMaxima: number = 0;

  errorMessage: string = '';
  private alertTimeout: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private georefService: GeorefService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.registerForm = this.fb.group({

      username: ['', Validators.required],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator,
          this.passwordNotContainingUserData.bind(this)
        ]
      ],

      repeatPassword: ['', Validators.required],

      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required],

      tipoDocumento: ['1', Validators.required],
      numeroDocumento: ['', Validators.required],

      calle: ['', Validators.required],
      numero: ['', Validators.required],

      provincia: ['', Validators.required],
      departamento: ['', Validators.required],
      localidad: ['', Validators.required],

      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],

      aceptoTerminos: [false, Validators.requiredTrue]
    });

    // revalidar password cuando cambian datos sensibles
    ['username', 'nombre', 'apellido', 'correoElectronico'].forEach(field => {
      this.registerForm.get(field)?.valueChanges.subscribe(() => {
        this.registerForm.get('password')?.updateValueAndValidity();
      });
    });

    // capitalización
    this.registerForm.get('nombre')?.valueChanges.subscribe(v =>
      this.aplicarCapitalizacion('nombre', v)
    );

    this.registerForm.get('apellido')?.valueChanges.subscribe(v =>
      this.aplicarCapitalizacion('apellido', v)
    );

    this.cargarProvincias();
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {

    const value = control.value || '';

    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=;]/.test(value);

    return (hasLetter && hasNumber && hasSpecial)
      ? null
      : { weakPassword: true };
  }
  //revisar esto
  passwordNotContainingUserData(control: AbstractControl): ValidationErrors | null {

    const password = (control.value || '').toLowerCase();

    const username = (this.registerForm?.get('username')?.value || '').toLowerCase();
    const nombre = (this.registerForm?.get('nombre')?.value || '').toLowerCase();
    const apellido = (this.registerForm?.get('apellido')?.value || '').toLowerCase();
    const email = (this.registerForm?.get('correoElectronico')?.value || '').toLowerCase();

    const forbidden = [username, nombre, apellido, email].filter(v => v && v.length >= 3);

    const contains = forbidden.some(v => password.includes(v));

    return contains ? { containsUserData: true } : null;
  }

  // CAPITALIZACIÓN
  private aplicarCapitalizacion(campo: string, value: string): void {

    if (!value || typeof value !== 'string') return;

    const control = this.registerForm.get(campo);
    if (!control) return;

    const capitalizado = value
      .toLowerCase()
      .split(' ')
      .filter(p => p.length > 0)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

    if (value !== capitalizado) {
      control.setValue(capitalizado, { emitEvent: false });
      this.registerForm.get('password')?.updateValueAndValidity();
    }
  }

  // GEOREF
  cargarProvincias(): void {
    this.georefService.getProvincias()
      .subscribe((res: { provincias: Provincia[] }) => {
        this.provincias = res.provincias;
      });
  }

  onProvinciaChange(): void {

    const idProvincia = this.registerForm.get('provincia')?.value;

    this.departamentos = [];
    this.localidades = [];
    this.callesFiltradas = [];
    this.resetDireccion();

    this.registerForm.patchValue({
      departamento: '',
      localidad: '',
      calle: ''
    });

    if (!idProvincia) return;

    this.georefService.getDepartamentosPorProvincia(idProvincia)
      .subscribe((res: { departamentos: Departamento[] }) => {
        this.departamentos = res.departamentos;
      });
  }

  onDepartamentoChange(): void {

    const idProvincia = this.registerForm.get('provincia')?.value;
    const idDepartamento = this.registerForm.get('departamento')?.value;

    this.localidades = [];
    this.callesFiltradas = [];
    this.resetDireccion();

    this.registerForm.patchValue({
      localidad: '',
      calle: ''
    });

    if (!idProvincia || !idDepartamento) return;

    this.georefService.getLocalidades(idProvincia, idDepartamento)
      .subscribe((res: { localidades: Localidad[] }) => {
        this.localidades = res.localidades;
      });
  }

  resetDireccion(): void {
    this.calleSeleccionada = null;
    this.alturaMaxima = 0;

    this.registerForm.patchValue({
      numero: ''
    });

    this.registerForm.get('numero')?.setErrors(null);
  }

  buscarCalles(event: any): void {

    const query = (event.query || '').toUpperCase();

    const provincia = this.registerForm.get('provincia')?.value;
    const departamento = this.registerForm.get('departamento')?.value;

    if (!provincia || !departamento || query.length < 2) {
      this.callesFiltradas = [];
      return;
    }

    this.georefService.getCalles(provincia, departamento)
      .subscribe((res: { calles: any[] }) => {

        this.callesFiltradas = res.calles
          .filter(c => c.nombre.toUpperCase().includes(query))
          .map(c => ({
            ...c,
            nombre: c.nombre.toUpperCase()
          }));
      });
  }

  onCalleSelect(event: any): void {
    this.calleSeleccionada = event;

    const derecha = event.altura_fin_derecha || 0;
    const izquierda = event.altura_fin_izquierda || 0;

    this.alturaMaxima = Math.max(derecha, izquierda);
  }

  // STEPS
  nextStep(): void {
    if (!this.validarPaso1()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Completá los datos personales correctamente'
      });
      return;
    }

    this.step = 2;
  }

  prevStep(): void {
    this.step = 1;
  }

  // VALIDACIONES
  validarPaso1(): boolean {

    const campos = [
      'nombre','apellido','sexo',
      'tipoDocumento','numeroDocumento',
      'calle','numero',
      'provincia','departamento','localidad',
      'telefono','correoElectronico'
    ];

    campos.forEach(c => this.registerForm.get(c)?.markAsTouched());

    return campos.every(c => this.registerForm.get(c)?.valid);
  }

  validarPaso2(): boolean {

    const campos = ['username','password','repeatPassword'];

    campos.forEach(c => this.registerForm.get(c)?.markAsTouched());

    if (!campos.every(c => this.registerForm.get(c)?.valid)) return false;

    if (this.passwordsNoCoinciden()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden'
      });
      return false;
    }

    if (!this.registerForm.get('aceptoTerminos')?.value) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Términos y condiciones',
        detail: 'Debes aceptar los términos para continuar'
      });
      return false;
    }

    return true;
  }

  passwordsNoCoinciden(): boolean {
    return this.registerForm.value.password !== this.registerForm.value.repeatPassword;
  }

  // SUBMIT
  register(): void {

    if (!this.validarPaso2()) return;

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
          calle: form.calle.nombre,
          numero: form.numero,
          localidad: form.localidad,
          departamento: form.departamento,
          provincia: form.provincia
        },
        telefono: form.telefono,
        correoElectronico: form.correoElectronico
      }
    };

    this.authService.registrarNuevoUsuario(payload).subscribe({
      next: (response: any) => {
        if(response.success){
          this.cargando = false;
          this.router.navigate(['/ingresar-codigo'], {
            queryParams: {
              id_usuario: response.data.id_usuario,
              accion: 1
            }
          });
        }else{
            this.showError(response.message);
            this.cargando = false;
        }
      },
      error: (err: any) => {
        this.showError(
          err?.error?.message || 'Ha ocurrido un error inesperado'
        );
        console.log(err)
        this.cargando = false;
      }
    });





    /*setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Usuario creado correctamente'
      });

      this.router.navigate(['/login']);
      this.cargando = false;
    }, 1000);*/
  }

  private showError(message: string) {
    this.errorMessage = message;

    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}