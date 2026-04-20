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
    this.initLiveValidations();
  }

  private initForm(): void {

    this.perfilForm = this.fb.group({

      username: ['', [Validators.required]],

      nombre: ['', [Validators.required, this.soloLetrasValidator]],
      apellido: ['', [Validators.required, this.soloLetrasValidator]],
      sexo: ['', Validators.required],

      tipoDocumento: ['', Validators.required],

      numeroDocumento: ['', [Validators.required, this.soloNumerosValidator]],

      calle: ['', Validators.required],
      numero: ['', [Validators.required, this.soloNumerosValidator, this.validarAltura.bind(this)]],

      provincia: ['', Validators.required],
      departamento: ['', Validators.required],
      localidad: ['', Validators.required],

      telefono: ['', [Validators.required, this.soloNumerosValidator]],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });

    this.perfilForm.disable();
  }

  soloLetrasValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(value) ? null : { soloLetras: true };
  }

  soloNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    return /^[0-9]+$/.test(value) ? null : { soloNumeros: true };
  }

  validarAltura(control: AbstractControl): ValidationErrors | null {

    const valor = Number(control.value);
    if (!this.alturaMaxima) return null;

    return valor > this.alturaMaxima
      ? { alturaInvalida: true }
      : null;
  }

  private initLiveValidations(): void {

    ['numeroDocumento', 'numero', 'telefono'].forEach(field => {
      this.perfilForm.get(field)?.valueChanges.subscribe(v => {
        if (v) {
          const limpio = v.replace(/[^0-9]/g, '');
          if (v !== limpio) {
            this.perfilForm.get(field)?.setValue(limpio, { emitEvent: false });
          }
        }
      });
    });

    ['nombre', 'apellido'].forEach(field => {
      this.perfilForm.get(field)?.valueChanges.subscribe(v => {
        if (!v) return;

        const capitalizado = v
          .toLowerCase()
          .split(' ')
          .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(' ');

        if (v !== capitalizado) {
          this.perfilForm.get(field)?.setValue(capitalizado, { emitEvent: false });
        }
      });
    });
  }

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
          provincia,
          departamento,
          localidad,
          telefono: data.datos_personales.contacto.telefono,
          correoElectronico: data.datos_personales.contacto.correo_electronico
        });

        this.georefService.getDepartamentosPorProvincia(provincia)
          .subscribe((resDep: any) => {

            this.departamentos = resDep.departamentos;

            this.georefService.getLocalidades(provincia, departamento)
              .subscribe((resLoc: any) => {

                this.localidades = resLoc.localidades;
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

  toggleEditar(): void {
    this.editando = true;
    this.perfilForm.enable();
  }

  cancelar(): void {
    this.editando = false;
    this.perfilForm.reset();
    this.perfilForm.disable();
    this.cargarPerfil();
  }

  guardar(): void {

    if (this.perfilForm.invalid) {
      this.showError('Revisá los datos del formulario');
      return;
    }

    this.cargando = true;

    const formValue = this.perfilForm.value;

    const payload = {
      username: formValue.username,
      datos_personales: {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        sexo: formValue.sexo,
        documento: {
          numero: formValue.numeroDocumento,
          tipo: formValue.tipoDocumento
        },
        domicilio: {
          calle: formValue.calle,
          numero: formValue.numero,
          localidad: formValue.localidad,
          departamento: formValue.departamento,
          provincia: formValue.provincia
        },
        contacto: {
          telefono: formValue.telefono,
          correo_electronico: formValue.correoElectronico
        }
      }
    };

    this.gameService.actualizarDatosPerfil(payload).subscribe({
      next: (res: { success: any; message: any; }) => {

        this.cargando = false;

        if (res?.success) {
          this.showMessage('Perfil actualizado correctamente');
          this.editando = false;
          this.perfilForm.disable();
        } else {
          this.showError(res?.message || 'Error al actualizar perfil');
        }
      },
      error: () => {
        this.cargando = false;
        this.showError('Error de conexión con el servidor');
      }
    });
  }

  cargarProvincias(): void {
    this.georefService.getProvincias()
      .subscribe((res: any) => this.provincias = res.provincias);
  }

  onProvinciaChange(): void {
    const idProvincia = this.perfilForm.get('provincia')?.value;
    if (!idProvincia) return;

    this.georefService.getDepartamentosPorProvincia(idProvincia)
      .subscribe((res: any) => this.departamentos = res.departamentos);
  }

  onDepartamentoChange(): void {

    const prov = this.perfilForm.get('provincia')?.value;
    const dep = this.perfilForm.get('departamento')?.value;

    if (!prov || !dep) return;

    this.georefService.getLocalidades(prov, dep)
      .subscribe((res: any) => this.localidades = res.localidades);
  }

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
    control?.updateValueAndValidity();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.showMessage('Sesión cerrada correctamente');

    setTimeout(() => this.router.navigate(['/iniciar-sesion']), 800);
  }

  eliminarCuenta(): void {

   const confirmacion = confirm('¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.');
    
   if (!confirmacion) return;
    
   this.cargando = true;
    
   this.gameService.eliminarCuenta().subscribe({
     next: (res: any) => {
      
       this.cargando = false;
      
       if (res?.success) {
         this.showMessage('Cuenta eliminada correctamente');
        
         this.authService.logout();
        
         setTimeout(() => {
           this.router.navigate(['/iniciar-sesion']);
         }, 800);
        
       } else {
         this.showError(res?.message || 'No se pudo eliminar la cuenta');
       }
     },
     error: () => {
       this.cargando = false;
       this.showError('Error de conexión con el servidor');
     }
   });
  }


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