import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CoctelesService } from '../../services/cocteles.service';
import { AuthService } from '../../services/auth.service';
import { CoctelDetallado } from '../../models/models';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-confirmar-preparacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>warning</mat-icon>
      Confirmar Preparación
    </h2>
    <mat-dialog-content>
      <p><strong>¿Estás seguro de preparar este cóctel?</strong></p>
      
      <!-- cantidad cocteles -->
      <div class="cantidad-section">
        <label>Cantidad de cócteles a preparar:</label>
        <div class="cantidad-control">
          <button mat-icon-button (click)="decrementarCantidad()" [disabled]="cantidad <= 1">
            <mat-icon>remove</mat-icon>
          </button>
          <input type="number" 
                 [(ngModel)]="cantidad" 
                 min="1" 
                 max="20"
                 (input)="validarCantidad()">
          <button mat-icon-button (click)="incrementarCantidad()" [disabled]="cantidad >= 20">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <p class="info-text small">Máximo 20 cócteles por preparación</p>
      </div>

      <p class="ingredientes-titulo">Se descontarán los siguientes ingredientes del inventario:</p>
      
      <div class="ingredientes-lista">
        <div *ngFor="let ing of data.ingredientes" class="ingrediente">
          <mat-icon [class.disponible]="ing.disponible" 
                    [class.no-disponible]="!ing.disponible">
            {{ ing.disponible ? 'check_circle' : 'cancel' }}
          </mat-icon>
          <div class="ing-detalles">
            <span class="ing-nombre">{{ ing.nombreInsumo }}</span>
            <span class="ing-cantidad">
              {{ ing.cantidad * cantidad | number:'1.0-2' }} {{ ing.unidad }}
              <span class="cantidad-unitaria" *ngIf="cantidad > 1">
                ({{ ing.cantidad }} × {{ cantidad }})
              </span>
            </span>
          </div>
        </div>
      </div>

      <div *ngIf="data.tieneSustituciones" class="opciones">
        <mat-checkbox [(ngModel)]="permitirSustituciones" color="primary">
          Permitir usar sustituciones automáticas
        </mat-checkbox>
        <p class="info-text">
          <mat-icon>info</mat-icon>
          Si está activado, se usarán ingredientes sustitutos si alguno no está disponible
        </p>
      </div>

      <div *ngIf="cantidad > 5" class="advertencia">
        <mat-icon>warning</mat-icon>
        <span>Preparando {{ cantidad }} cócteles. Verifica que tengas suficientes ingredientes.</span>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" 
              [mat-dialog-close]="{permitirSustituciones: permitirSustituciones, cantidad: cantidad}">
        <mat-icon>check</mat-icon>
        Preparar {{ cantidad }} {{ cantidad === 1 ? 'Cóctel' : 'Cócteles' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    mat-dialog-content {
      min-width: 450px;
      max-width: 600px;
      padding: 1.5rem;
    }
    .cantidad-section {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    }
    .cantidad-section label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }
    .cantidad-control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 0.5rem 0;
    }
    .cantidad-control input {
      width: 80px;
      height: 40px;
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      border: 2px solid #ddd;
      border-radius: 8px;
      outline: none;
    }
    .cantidad-control input:focus {
      border-color: #1976d2;
    }
    .cantidad-control button {
      width: 40px;
      height: 40px;
    }
    .ingredientes-titulo {
      font-weight: 600;
      margin: 1.5rem 0 0.5rem 0;
    }
    .ingredientes-lista {
      margin: 1rem 0;
      max-height: 300px;
      overflow-y: auto;
    }
    .ingrediente {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f5f5f5;
      margin-bottom: 0.5rem;
      border-radius: 8px;
    }
    .ing-detalles {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .ing-nombre {
      font-weight: 600;
      color: #333;
    }
    .ing-cantidad {
      font-size: 0.9rem;
      color: #666;
    }
    .cantidad-unitaria {
      font-size: 0.85rem;
      color: #999;
      margin-left: 0.5rem;
    }
    .disponible {
      color: #4caf50;
    }
    .no-disponible {
      color: #f44336;
    }
    .opciones {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #ddd;
    }
    .info-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #666;
      margin: 0.5rem 0 0 2rem;
    }
    .info-text.small {
      font-size: 0.75rem;
      margin: 0.25rem 0 0 0;
      justify-content: center;
    }
    .info-text mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }
    .advertencia {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      border-radius: 4px;
      margin-top: 1rem;
      color: #e65100;
      font-size: 0.9rem;
    }
    .advertencia mat-icon {
      color: #ff9800;
    }
    mat-dialog-actions {
      padding: 1rem 1.5rem;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class ConfirmarPreparacionDialog {
  permitirSustituciones = true;
  cantidad = 1;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  incrementarCantidad() {
    if (this.cantidad < 20) {
      this.cantidad++;
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  validarCantidad() {
    if (this.cantidad < 1) this.cantidad = 1;
    if (this.cantidad > 20) this.cantidad = 20;
    this.cantidad = Math.floor(this.cantidad);
  }
}

@Component({
  selector: 'app-detalle-coctel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule
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
  preparando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coctelesService: CoctelesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    if (!this.coctel) return;

    // Abrir diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmarPreparacionDialog, {
      width: '500px',
      data: {
        ingredientes: this.coctel.ingredientes,
        tieneSustituciones: this.coctel.sustituciones.length > 0
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.prepararCoctel(resultado.permitirSustituciones, resultado.cantidad);
      }
    });
  }

  prepararCoctel(permitirSustituciones: boolean, cantidad: number = 1) {
    if (!this.coctel || this.preparando) return;

    this.preparando = true;
    const user = this.authService.getUser();

    // llamar al endpoint x veces si cantidad es mayor a 1
    const preparaciones = Array(cantidad).fill(null).map(() => 
      this.coctelesService.prepararCoctel(
        this.coctel!.coctel.id, 
        user.id, 
        permitirSustituciones
      )
    );

    this.prepararSecuencial(preparaciones, cantidad, permitirSustituciones);
  }

  prepararSecuencial(preparaciones: any[], cantidad: number, permitirSustituciones: boolean) {
    let completadas = 0;
    let errores: string[] = [];
    let todasSustituciones: any[] = [];

    const ejecutarSiguiente = (index: number) => {
      if (index >= preparaciones.length) {
        this.preparando = false;
        
        if (errores.length === 0) {
          this.enPreparacion = true;
          this.pasoActual = 0;
          this.iniciarTimer();

          let mensaje = `¡${cantidad} ${cantidad === 1 ? 'cóctel preparado' : 'cócteles preparados'} exitosamente!`;
          
          if (todasSustituciones.length > 0) {
            const sustUnicas = [...new Set(todasSustituciones.map(s => 
              `${s.original} → ${s.sustituto}`
            ))];
            mensaje += ` Con sustituciones: ${sustUnicas.join(', ')}`;
          }
          
          this.snackBar.open(mensaje, 'Cerrar', { duration: 7000 });
        } else {
          this.snackBar.open(
            `Se prepararon ${completadas} de ${cantidad}. Errores: ${errores[0]}`, 
            'Cerrar', 
            { duration: 7000 }
          );
        }
        return;
      }

      preparaciones[index].subscribe({
        next: (response: any) => {
          completadas++;
          if (response.usaSustituciones) {
            todasSustituciones.push(...response.sustitucionesUsadas);
          }
          ejecutarSiguiente(index + 1);
        },
        error: (err: any) => {
          const errorMsg = err.error?.error || err.error?.mensaje || 'Error desconocido';
          errores.push(errorMsg);
          this.preparando = false;
          
          this.snackBar.open(
            `Error al preparar cóctel ${index + 1}: ${errorMsg}`, 
            'Cerrar', 
            { duration: 7000 }
          );
        }
      });
    };

    ejecutarSiguiente(0);
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
    this.completado = true;
    this.enPreparacion = false;
    this.snackBar.open('¡Coctel completado exitosamente!', 'Cerrar', { duration: 5000 });
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