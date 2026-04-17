import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Provincia, Departamento, Localidad } from '../../models/georef.interfaces';
import { GeorefService } from '../../services/georef.service';

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

  // 🔥 AUTOCOMPLETE CALLES
  callesFiltradas: any[] = [];

  // 🔥 VALIDACIÓN DIRECCIÓN
  calleSeleccionada: any = null;
  alturaMaxima: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private georefService: GeorefService
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

      provincia: ['', Validators.required],
      departamento: ['', Validators.required],
      localidad: ['', Validators.required],

      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });

    this.registerForm.get('calle')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const upper = value.toUpperCase();
        if (value !== upper) {
          this.registerForm.get('calle')?.setValue(upper, { emitEvent: false });
        }
      }
    });

    this.cargarProvincias();
  }

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
          .filter(c => c.nombre.includes(query))
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

  // =========================
  // STEPS
  // =========================
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

  // =========================
  // VALIDACIONES
  // =========================
  validarPaso1(): boolean {
    const campos = [
      'nombre','apellido','sexo',
      'tipoDocumento','numeroDocumento',
      'calle','numero',
      'provincia','departamento','localidad',
      'telefono','correoElectronico'
    ];

    this.marcarCampos(campos);

    const formValido = campos.every(c => this.registerForm.get(c)?.valid);

    if (this.registerForm.get('numero')?.hasError('direccionInvalida')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Dirección inválida',
        detail: 'El número ingresado supera la altura máxima de la calle'
      });
      return false;
    }

    return formValido;
  }

  validarPaso2(): boolean {
    const campos = ['username','password','repeatPassword'];

    this.marcarCampos(campos);

    if (!campos.every(c => this.registerForm.get(c)?.valid)) return false;

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

  marcarCampos(campos: string[]) {
    campos.forEach(c => this.registerForm.get(c)?.markAsTouched());
  }

  passwordsNoCoinciden(): boolean {
    return this.registerForm.value.password !== this.registerForm.value.repeatPassword;
  }

  // =========================
  // SUBMIT
  // =========================
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