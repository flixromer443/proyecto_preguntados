import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ingresar-codigo',
  templateUrl: './ingresar-codigo.component.html',
  styleUrls: ['./ingresar-codigo.component.css']
})
export class IngresarCodigoComponent implements OnInit {

  idUsuario!: number;

  codeForm!: FormGroup;
  cargando: boolean = false;

  errorMessage: string = '';
  private alertTimeout: any;

  @ViewChild('btnVerify') btnVerify!: ElementRef<HTMLButtonElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      console.log(params['id_usuario']);
      this.idUsuario = Number(params['id_usuario']);
      console.log('ID usuario:', this.idUsuario);
    });

    this.codeForm = this.fb.group({
      d1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }

  // =========================
  // INPUT AUTO MOVE
  // =========================
  onInput(event: any, next: HTMLInputElement | HTMLButtonElement | null): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length === 1 && next) {
      next.focus();
    }
  }

  // =========================
  // BACKSPACE MOVE
  // =========================
  onBackspace(event: Event, prev: HTMLInputElement | null): void {

    const keyboardEvent = event as KeyboardEvent;
    const input = keyboardEvent.target as HTMLInputElement;

    if (!input.value && prev) {
      prev.focus();
    }
  }

  // =========================
  // VERIFY CODE
  // =========================
  verifyCode(): void {

    if (this.codeForm.invalid) {
      this.showError('Ingresá los 6 dígitos del código');
      return;
    }

    const code =
      this.codeForm.value.d1 +
      this.codeForm.value.d2 +
      this.codeForm.value.d3 +
      this.codeForm.value.d4 +
      this.codeForm.value.d5 +
      this.codeForm.value.d6;

    this.cargando = true;

    console.log('CODE:', code);

    this.cargando = false;
  }

  // =========================
  // ERROR
  // =========================
  private showError(message: string) {
    this.errorMessage = message;

    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  resendCode(){

  }
}

