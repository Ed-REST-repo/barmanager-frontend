import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoctelesService } from '../../services/cocteles.service';
import { CoctelDisponibilidad } from '../../models/models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-catalogo-cocteles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule
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
    
    .filtros-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    
    .filtro-chip {
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      border: 2px solid #e0e0e0;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
    }
    
    .filtro-chip:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .filtro-chip.activo {
      border-color: #1976d2;
      background: #1976d2;
      color: white;
    }
    
    .filtro-chip.facil.activo {
      border-color: #4caf50;
      background: #4caf50;
    }
    
    .filtro-chip.media.activo {
      border-color: #ff9800;
      background: #ff9800;
    }
    
    .filtro-chip.dificil.activo {
      border-color: #f44336;
      background: #f44336;
    }
    
    .filtro-chip.experto.activo {
      border-color: #9c27b0;
      background: #9c27b0;
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
      position: relative;
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
    
    /* Badge de dificultad en la tarjeta */
    .dificultad-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .dificultad-facil {
      background: #4caf50;
      color: white;
    }
    
    .dificultad-media {
      background: #ff9800;
      color: white;
    }

    .dificultad-dificil {
      background: #f44336;
      color: white;
    }
    
    .dificultad-experto {
      background: #9c27b0;
      color: white;
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
    
    .sin-resultados {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    
    .sin-resultados mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
    }
  `]
})
export class CatalogoCoctelesComponent implements OnInit {
  cocteles: CoctelDisponibilidad[] = [];
  coctelesFiltrados: CoctelDisponibilidad[] = [];
  loading = true;
  
  dificultadSeleccionada: string | null = null;
  dificultades = ['Facil', 'Media', 'Dificil', 'Experto'];

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
        this.coctelesFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filtrarPorDificultad(dificultad: string) {
    if (this.dificultadSeleccionada === dificultad) {
      this.dificultadSeleccionada = null;
      this.coctelesFiltrados = this.cocteles;
    } else {
      this.dificultadSeleccionada = dificultad;
      this.coctelesFiltrados = this.cocteles.filter(
        coctel => coctel.dificultad === dificultad
      );
    }
  }

  esDificultadActiva(dificultad: string): boolean {
    return this.dificultadSeleccionada === dificultad;
  }

  getDificultadClass(dificultad: string): string {
    if (dificultad === 'Facil') return 'dificultad-facil';
    if (dificultad === 'Media') return 'dificultad-media';
    if (dificultad === 'Dificil') return 'dificultad-dificil';
    if (dificultad === 'Experto') return 'dificultad-experto';
    return 'dificultad-media';
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