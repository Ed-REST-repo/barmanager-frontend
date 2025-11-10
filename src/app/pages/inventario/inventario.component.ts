import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventarioService } from '../../services/inventario.service';
import { Insumo } from '../../models/models';
import { ReponerDialogComponent } from './reponer-dialog/reponer-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  insumos: Insumo[] = [];
  insumosBajoStock: Insumo[] = [];
  loading = true;
  vistaActual: 'todos' | 'bajoStock' = 'todos';

  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    if (this.vistaActual === 'todos') {
      this.inventarioService.obtenerTodos().subscribe({
        next: (data) => {
          this.insumos = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.snackBar.open('Error al cargar inventario', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.inventarioService.obtenerBajoStock().subscribe({
        next: (data) => {
          this.insumosBajoStock = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.snackBar.open('Error al cargar insumos bajo stock', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cambiarVista(vista: 'todos' | 'bajoStock') {
    this.vistaActual = vista;
    this.cargarDatos();
  }

  abrirDialogReponer(insumo: Insumo) {
    const dialogRef = this.dialog.open(ReponerDialogComponent, {
      width: '500px',
      data: { insumo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reponerStock(insumo.id, result.cantidad);
      }
    });
  }

  reponerStock(id: number, cantidad: number) {
    this.inventarioService.reponerStock(id, cantidad).subscribe({
      next: () => {
        this.snackBar.open('Stock repuesto exitosamente', 'Cerrar', { duration: 3000 });
        this.cargarDatos(); // Recargar datos
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al reponer stock', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getEstadoClass(insumo: Insumo): string {
    if (insumo.cantidadDisponible <= 0) return 'agotado';
    if (insumo.cantidadDisponible <= insumo.cantidadMinima) return 'bajo';
    return 'ok';
  }

  getEstadoTexto(insumo: Insumo): string {
    if (insumo.cantidadDisponible <= 0) return 'Agotado';
    if (insumo.cantidadDisponible <= insumo.cantidadMinima) return 'Bajo Stock';
    return 'Disponible';
  }

  getFaltante(insumo: Insumo): number {
    return Math.max(0, insumo.cantidadMinima - insumo.cantidadDisponible);
  }

  getInsumoIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      'LICOR': '🍾',
      'MIXER': '🥤',
      'JARABE': '🍯',
      'FRUTA': '🍋',
      'GARNISH': '🍒',
      'HIERBAS': '🌿',
      'ESPECIAS': '🧂',
      'BITTER': '💧',
      'CREMA': '🥛'
    };
    return icons[tipo] || '📦';
  }
}