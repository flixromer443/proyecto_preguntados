import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { Usuario } from '../../models/admin.interfaces';

@Component({
  selector: 'app-usuarios-administrador',
  templateUrl: './usuarios-administrador.component.html',
  styleUrls: ['./usuarios-administrador.component.css']
})
export class UsuariosAdministradorComponent implements OnInit {

  usuarios: Usuario[] = [];
  cargando = true;

  itemsPorPagina = 5;
  paginaActual = 1;

  mostrarModal = false;
  accionPendiente: 'suspender' | 'rehabilitar' | null = null;
  idUsuarioSeleccionado: number | null = null;

  procesandoAccion = false;

  rolActual: number = 0; // 1 jugador, 2 admin, 3 super

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.datosCompartidosService.esconderBuscador.next(false);
    this.datosCompartidosService.esconderFooter.next(false);
  }

  ngOnInit(): void {

    const esAdmin = this.authService.isLoggedInAsAdministrador();
    const esSuper = this.authService.isLoggedInAsSuperUsuario();

    if (!esAdmin && !esSuper) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    if (esSuper) this.rolActual = 3;
    else this.rolActual = 2;

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;

    this.adminService.obtenerUsuarios().subscribe({
      next: (data: any[]) => {

        this.usuarios = data.map(u => ({
          id: u.id,
          username: u.username,
          rol: Number(u.id_rol),
          estado: Number(u.id_estado)
        }));

        this.cargando = false;
        this.paginaActual = 1;
      },
      error: () => this.cargando = false
    });
  }

  puedeGestionar(usuario: Usuario): boolean {

    // 👤 jugador: admin y super pueden
    if (usuario.rol === 1) return this.rolActual >= 2;

    // 🛡 admin: solo super
    if (usuario.rol === 2) return this.rolActual === 3;

    // 👑 super: nadie lo toca
    if (usuario.rol === 3) return false;

    return false;
  }

  // =========================
  // PAGINACIÓN
  // =========================
  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.usuarios.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.itemsPorPagina) || 1;
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  abrirModal(id: number, accion: 'suspender' | 'rehabilitar'): void {
    this.idUsuarioSeleccionado = id;
    this.accionPendiente = accion;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.idUsuarioSeleccionado = null;
    this.accionPendiente = null;
  }

  confirmar(): void {

    if (!this.idUsuarioSeleccionado || !this.accionPendiente) return;

    const usuario = this.usuarios.find(u => u.id === this.idUsuarioSeleccionado);
    if (!usuario) return;

    if (!this.puedeGestionar(usuario)) {
      alert('Sin permisos');
      this.cerrarModal();
      return;
    }

    const nuevoEstado = this.accionPendiente === 'suspender' ? 3 : 2;

    this.procesandoAccion = true;

    this.adminService.cambiarEstadoUsuario(this.idUsuarioSeleccionado, nuevoEstado)
      .subscribe({
        next: () => {

          this.usuarios = this.usuarios.map(u =>
            u.id === this.idUsuarioSeleccionado
              ? { ...u, estado: nuevoEstado }
              : u
          );

          this.procesandoAccion = false;
          this.cerrarModal();
        },
        error: () => {
          this.procesandoAccion = false;
          alert('Error');
        }
      });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}