import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
imports: [
  CommonModule,
  ReactiveFormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatProgressSpinnerModule
],
  templateUrl: './login.component.html',
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      width: 400px;
      padding: 2rem;
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    h1 {
      margin: 0;
    }
    .full-width {
      width: 100%;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    button[type="submit"] {
      height: 48px;
      margin-top: 1rem;
    }
    .demo-section {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #ddd;
      text-align: center;
    }
    .demo-section p {
      margin-bottom: 0.5rem;
      color: #666;
    }
    .demo-section button {
      margin: 0 0.5rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;

        const rol = response.rol;

        if (rol === 'ADMINISTRADOR') {
          this.router.navigate(['/inventario']);
        } else if (rol === 'BARTENDER') {
          this.router.navigate(['/cocteles']);
        } else {
          this.router.navigate(['/']);
        }

        this.snackBar.open(`Bienvenido, ${response.usuario.nombre}!`, 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al iniciar sesion', 'Cerrar', { duration: 3000 });
      }
    });
  }


  demo(usuario: string, contrasena: string) {
    this.loginForm.patchValue({ usuario, contrasena });
    this.onSubmit();
  }
}