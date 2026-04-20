import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GeorefService } from '../../services/georef.service';
import { Provincia, Departamento, Localidad } from '../../models/georef.interfaces';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  perfilForm!: FormGroup;

  cargando = false;
  editando = false;

  provincias: Provincia[] = [];
  departamentos: Departamento[] = [];
  localidades: Localidad[] = [];

  callesFiltradas: any[] = [];
  calleSeleccionada: any = null;
  alturaMaxima: number = 0;

  errorMessage: string = '';
  message: string = '';
  private alertTimeout: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private gameService: GameService,
    private georefService: GeorefService
  ) {}

  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.initForm();
    this.cargarProvincias();
    this.cargarPerfil();
  }

  // =========================
  // INIT FORM
  // =========================
  private initForm(): void {
    this.perfilForm = this.fb.group({
      username: [{ value: '', disabled: true }],

      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required],

      tipoDocumento: [{ value: '', disabled: true }],
      numeroDocumento: [{ value: '', disabled: true }],

      calle: ['', Validators.required],
      numero: ['', [Validators.required, this.validarAltura.bind(this)]],

      provincia: ['', Validators.required],
      departamento: ['', Validators.required],
      localidad: ['', Validators.required],

      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });

    this.perfilForm.disable();
  }

  // =========================
  // PERFIL (FIX ASYNC BUG)
  // =========================
  cargarPerfil(): void {

    this.cargando = true;

    this.gameService.obtenerDatosPerfil().subscribe({
      next: (res: any) => {

        const data = res.data;

        const provincia = data.datos_personales.domicilio.provincia;
        const departamento = data.datos_personales.domicilio.departamento;
        const localidad = data.datos_personales.domicilio.localidad;

        this.perfilForm.patchValue({
          username: data.username,
          nombre: data.datos_personales.nombre,
          apellido: data.datos_personales.apellido,
          sexo: data.datos_personales.sexo,
          tipoDocumento: data.datos_personales.documento.tipo,
          numeroDocumento: data.datos_personales.documento.numero,
          calle: data.datos_personales.domicilio.calle,
          numero: data.datos_personales.domicilio.numero,
          provincia: provincia,
          telefono: data.datos_personales.contacto.telefono,
          correoElectronico: data.datos_personales.contacto.correoElectronico
        });

        // 🔥 ORDEN CORRECTO (FIX BUG SELECT 25 DE MAYO)
        this.georefService.getDepartamentosPorProvincia(provincia)
          .subscribe((resDep: any) => {

            this.departamentos = resDep.departamentos;

            this.perfilForm.patchValue({ departamento });

            this.georefService.getLocalidades(provincia, departamento)
              .subscribe((resLoc: any) => {

                this.localidades = resLoc.localidades;

                this.perfilForm.patchValue({ localidad });

                this.cargando = false;
              });
          });
      },
      error: () => {
        this.cargando = false;
        this.showError('Error cargando perfil');
      }
    });
  }

  // =========================
  // EDICIÓN
  // =========================
  toggleEditar(): void {
    this.editando = true;
    this.perfilForm.enable();

    this.perfilForm.get('username')?.disable();
    this.perfilForm.get('tipoDocumento')?.disable();
    this.perfilForm.get('numeroDocumento')?.disable();
  }

  cancelar(): void {
    this.editando = false;

    this.perfilForm.reset();
    this.perfilForm.disable();

    this.cargarPerfil();
  }

  // =========================
  // GUARDAR
  // =========================
  guardar(): void {

    if (this.perfilForm.invalid) {
      this.showError('Revisá los datos del formulario');
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      this.cargando = false;
      this.showMessage('Perfil actualizado correctamente');
      this.editando = false;
      this.perfilForm.disable();
    }, 800);
  }

  // =========================
  // GEOREF
  // =========================
  cargarProvincias(): void {
    this.georefService.getProvincias()
      .subscribe((res: any) => this.provincias = res.provincias);
  }

  onProvinciaChange(): void {

    const idProvincia = this.perfilForm.get('provincia')?.value;
    if (!idProvincia) return;

    this.georefService.getDepartamentosPorProvincia(idProvincia)
      .subscribe((res: any) => {
        this.departamentos = res.departamentos;
      });
  }

  onDepartamentoChange(): void {

    const prov = this.perfilForm.get('provincia')?.value;
    const dep = this.perfilForm.get('departamento')?.value;

    if (!prov || !dep) return;

    this.georefService.getLocalidades(prov, dep)
      .subscribe((res: any) => {
        this.localidades = res.localidades;
      });
  }

  // =========================
  // CALLES
  // =========================
  buscarCalles(event: any): void {

    const query = (event.query || '').toUpperCase();
    const prov = this.perfilForm.get('provincia')?.value;
    const dep = this.perfilForm.get('departamento')?.value;

    if (!prov || !dep || query.length < 2) return;

    this.georefService.getCalles(prov, dep)
      .subscribe((res: any) => {

        this.callesFiltradas = res.calles.filter((c: any) =>
          c.nombre.toUpperCase().includes(query)
        );
      });
  }

  seleccionarCalle(calle: any): void {

    this.calleSeleccionada = calle;

    const finDerecha = calle.altura?.fin?.derecha || 0;
    const finIzquierda = calle.altura?.fin?.izquierda || 0;

    this.alturaMaxima = Math.max(finDerecha, finIzquierda);

    const control = this.perfilForm.get('numero');
    control?.setValue(control?.value);
    control?.updateValueAndValidity();
  }

  validarAltura(control: AbstractControl): ValidationErrors | null {

    const valor = Number(control.value);

    if (!this.alturaMaxima) return null;

    return valor > this.alturaMaxima
      ? { alturaInvalida: true }
      : null;
  }

  // =========================
  // SESIÓN
  // =========================
  cerrarSesion(): void {
    this.authService.logout();
    this.showMessage('Sesión cerrada correctamente');

    setTimeout(() => {
      this.router.navigate(['/iniciar-sesion']);
    }, 800);
  }

  // =========================
  // ALERTAS
  // =========================
  private showError(msg: string): void {
    this.errorMessage = msg;
    clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => this.errorMessage = '', 4000);
  }

  private showMessage(msg: string): void {
    this.message = msg;
    clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => this.message = '', 4000);
  }
}