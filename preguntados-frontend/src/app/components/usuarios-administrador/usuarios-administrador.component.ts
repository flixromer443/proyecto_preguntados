import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../../services/datos-compartidos.service';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { Usuario } from '../../models/admin.interfaces';

type AccionUsuario = 'suspender' | 'rehabilitar' | null;

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

  // modal
  mostrarModal = false;
  accionPendiente: AccionUsuario = null;
  idUsuarioSeleccionado: number | null = null;

  procesandoAccion = false;

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
    if (!this.authService.isLoggedInAsAdministrador()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

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

        this.paginaActual = 1;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  // PAGINACIÓN
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

  // MODAL
  abrirModal(id: number, accion: AccionUsuario): void {
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
          alert('Error al actualizar usuario');
        }
      });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}