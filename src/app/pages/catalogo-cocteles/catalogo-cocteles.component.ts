import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoctelesService } from '../../services/cocteles.service';
import { CoctelDisponibilidad } from '../../models/models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-catalogo-cocteles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './catalogo-cocteles.component.html',
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      color: #333;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .coctel-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .coctel-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    .card-icon {
      font-size: 4rem;
      text-align: center;
      margin: 1rem 0;
    }
    mat-card-title {
      font-size: 1.5rem;
    }
    .disponibilidad {
      margin: 1rem 0;
    }
    .disponibilidad mat-chip {
      font-weight: 600;
    }
    .disponible {
      background: #4caf50 !important;
      color: white;
    }
    .sustituciones-chip {
      background: #ff9800 !important;
      color: white;
    }
    .no-disponible {
      background: #f44336 !important;
      color: white;
    }
    .ingredientes {
      margin: 0.5rem 0;
      color: #666;
    }
    .sustituciones {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ff9800;
      font-size: 0.9rem;
    }
    mat-card-actions {
      padding: 1rem;
    }
    mat-card-actions button {
      width: 100%;
    }
  `]
})
export class CatalogoCoctelesComponent implements OnInit {
  cocteles: CoctelDisponibilidad[] = [];
  loading = true;

  constructor(
    private coctelesService: CoctelesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCocteles();
  }

  cargarCocteles() {
    this.coctelesService.obtenerDisponibles().subscribe({
      next: (data) => {
        this.cocteles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/cocteles', id]);
  }

  getEstadoClass(estado: string): string {
    if (estado === 'DISPONIBLE') return 'disponible';
    if (estado === 'PREPARABLE_CON_SUSTITUCIONES') return 'sustituciones-chip';
    return 'no-disponible';
  }
}