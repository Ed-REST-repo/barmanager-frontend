import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoctelesService } from '../../services/cocteles.service';
import { AuthService } from '../../services/auth.service';
import { CoctelDetallado } from '../../models/models';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-detalle-coctel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './detalle-coctel.component.html',
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .header h1 {
      margin: 0;
      font-size: 2rem;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }
    .info-card {
      padding: 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }
    .coctel-icon {
      font-size: 6rem;
      margin-bottom: 1rem;
    }
    .descripcion {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 1rem;
    }
    .badges {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin: 1rem 0;
    }
    .estado {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 8px;
      background: #e8f5e9;
      color: #2e7d32;
      margin-top: 1rem;
    }
    .estado.warning {
      background: #fff3e0;
      color: #e65100;
    }
    .section-card {
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .section-card h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .ingredientes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .ingrediente-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
    }
    .ingrediente-item.no-disponible {
      border-left-color: #f44336;
      opacity: 0.7;
    }
    .ing-icon {
      font-size: 2.5rem;
    }
    .ing-info {
      flex: 1;
    }
    .ing-info h4 {
      margin: 0 0 0.25rem 0;
    }
    .cantidad {
      margin: 0;
      color: #666;
      font-weight: 600;
    }
    .notas {
      margin: 0.25rem 0 0 0;
      font-size: 0.85rem;
      color: #999;
    }
    .success {
      color: #4caf50;
    }
    .error {
      color: #f44336;
    }
    .sustituciones-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #ddd;
    }
    .sustituciones-section h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ff9800;
    }
    .sustitucion-item {
      padding: 1rem;
      background: #fff3e0;
      border-radius: 8px;
      margin: 1rem 0;
    }
    .sust-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.5rem 0;
    }
    .sust-cantidad {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }
    .sust-notas {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      color: #999;
    }
    .calidad {
      display: flex;
      gap: 0.25rem;
    }
    .calidad mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #ff9800;
    }
    .pasos-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .paso-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .paso-numero {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #673ab7;
      color: white;
      border-radius: 50%;
      font-weight: bold;
    }
    .paso-item p {
      margin: 0;
      align-self: center;
    }
    .acciones {
      text-align: center;
      margin-top: 2rem;
    }
    .acciones button {
      height: 56px;
      padding: 0 3rem;
      font-size: 1.1rem;
    }
    .paso-actual {
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .progreso {
      margin-bottom: 2rem;
    }
    .progreso p {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }
    .paso-content {
      text-align: center;
      margin: 2rem 0;
    }
    .paso-content h3 {
      font-size: 2rem;
      margin: 0 0 1rem 0;
    }
    .paso-desc {
      font-size: 1.2rem;
      margin: 0 0 1.5rem 0;
    }
    .timer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #673ab7;
    }
    .paso-acciones {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
    .paso-acciones button {
      flex: 1;
    }
    .completado {
      text-align: center;
      padding: 3rem;
    }
    .success-icon {
      font-size: 6rem;
      width: 6rem;
      height: 6rem;
      color: #4caf50;
    }
    .completado h2 {
      margin: 1rem 0;
    }
    .completado button {
      margin-top: 2rem;
    }
  `]
})
export class DetalleCoctelComponent implements OnInit {
  coctel?: CoctelDetallado;
  loading = true;
  enPreparacion = false;
  completado = false;
  pasoActual = 0;
  tiempoRestante = 0;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coctelesService: CoctelesService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.cargarDetalle(id);
  }

  cargarDetalle(id: number) {
    this.coctelesService.obtenerDetalle(id).subscribe({
      next: (data) => {
        this.coctel = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.snackBar.open('Error al cargar coctel', 'Cerrar', { duration: 3000 });
      }
    });
  }

  iniciarPreparacion() {
    this.enPreparacion = true;
    this.pasoActual = 0;
    this.iniciarTimer();
  }

  iniciarTimer() {
    if (!this.coctel) return;
    const paso = this.coctel.pasos[this.pasoActual];
    this.tiempoRestante = paso.duracionSegundos;

    this.timerInterval = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  siguientePaso() {
    if (!this.coctel) return;

    clearInterval(this.timerInterval);

    if (this.pasoActual < this.coctel.pasos.length - 1) {
      this.pasoActual++;
      this.iniciarTimer();
    } else {
      this.finalizar();
    }
  }

  pasoAnterior() {
    clearInterval(this.timerInterval);
    if (this.pasoActual > 0) {
      this.pasoActual--;
      this.iniciarTimer();
    }
  }

  finalizar() {
    if (!this.coctel) return;

    const user = this.authService.getUser();
    this.coctelesService.prepararCoctel(this.coctel.coctel.id, user.id).subscribe({
      next: (response) => {
        this.completado = true;
        this.enPreparacion = false;
        this.snackBar.open('¡Coctel preparado exitosamente!', 'Cerrar', { duration: 5000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar preparación', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver() {
    this.router.navigate(['/cocteles']);
  }

  getIngredienteIcon(nombre: string): string {
    const lower = nombre.toLowerCase();
    if (lower.includes('ron')) return '🥃';
    if (lower.includes('vodka')) return '🍸';
    if (lower.includes('tequila')) return '🥃';
    if (lower.includes('gin')) return '🍸';
    if (lower.includes('limón') || lower.includes('lima')) return '🍋';
    if (lower.includes('menta')) return '🌿';
    if (lower.includes('azúcar')) return '🧂';
    return '🍹';
  }

  getStars(calidad: number): number[] {
    return Array(calidad).fill(0);
  }
}