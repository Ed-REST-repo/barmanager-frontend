import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { EstadisticasService } from '../../services/estadisticas.service';
import { ResumenGeneral } from '../../models/models';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TooltipItem } from 'chart.js';

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>
          <mat-icon>bar_chart</mat-icon>
          Dashboard de Estadísticas
        </h1>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && datos" class="stats-grid">
        
        <!-- resumen -->
        <mat-card class="stat-card highlight">
          <div class="stat-content">
            <div class="stat-icon">🍹</div>
            <div class="stat-info">
              <h3>Total Preparaciones</h3>
              <p class="stat-number">{{ datos.totalPreparaciones }}</p>
            </div>
          </div>
        </mat-card>

        <!-- cocteles mas preparados -->
        <mat-card class="chart-card full-width">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>emoji_events</mat-icon>
              Top 10 Cócteles Más Preparados
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container" #cocteles>
              <canvas id="chartCocteles"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- insumos mas utilizados -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>inventory_2</mat-icon>
              Top 10 Insumos Más Utilizados
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container" #insumos>
              <canvas id="chartInsumos"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- preparaciones por dificultad -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>speed</mat-icon>
              Preparaciones por Dificultad
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container" #dificultad>
              <canvas id="chartDificultad"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      margin-bottom: 2rem;
    }
    .header h1 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 2rem;
      color: #333;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      padding: 1.5rem;
    }
    .stat-card.highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .stat-icon {
      font-size: 3rem;
    }
    .stat-info h3 {
      margin: 0;
      font-size: 1rem;
      opacity: 0.9;
    }
    .stat-number {
      margin: 0.5rem 0 0 0;
      font-size: 2.5rem;
      font-weight: bold;
    }
    .chart-card {
      padding: 1.5rem;
    }
    .chart-card.full-width {
      grid-column: 1 / -1;
    }
    mat-card-header {
      margin-bottom: 1.5rem;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
    }
    .chart-container {
      height: 400px;
      position: relative;
    }
    canvas {
      max-height: 100%;
    }
  `]
})
export class DashboardEstadisticasComponent implements OnInit {
  datos?: ResumenGeneral;
  loading = true;

  // instancias Chart.js
  chartCocteles: any;
  chartInsumos: any;
  chartDificultad: any;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.estadisticasService.obtenerResumenGeneral().subscribe({
      next: (data) => {
        this.datos = data;
        this.loading = false;
        setTimeout(() => this.crearGraficos(), 100);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.loading = false;
      }
    });
  }

  crearGraficos() {
    if (!this.datos) return;

    import('chart.js/auto').then((Chart) => {
      this.crearGraficoCocteles(Chart.default);
      this.crearGraficoInsumos(Chart.default);
      this.crearGraficoDificultad(Chart.default);
    });
  }

  crearGraficoCocteles(Chart: any) {
    const ctx = document.getElementById('chartCocteles') as HTMLCanvasElement;
    if (!ctx || !this.datos) return;

    const labels = this.datos.coctelesMasPreparados.map(c => c.nombre);
    const data = this.datos.coctelesMasPreparados.map(c => c.preparaciones);

    this.chartCocteles = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Preparaciones',
          data: data,
          backgroundColor: [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#43e97b', '#fa709a', '#fee140', '#30cfd0',
            '#a8edea', '#fed6e3'
          ],
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
            tooltip: {
            callbacks: {
                label: (context: TooltipItem<'bar'>) => {
                const coctel = this.datos!.coctelesMasPreparados[context.dataIndex];
                return [
                    `Preparaciones: ${context.parsed.y}`,
                    `Categoría: ${coctel.categoria}`,
                    `Dificultad: ${coctel.dificultad}`
                ];
                }
            }
            }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }

  crearGraficoInsumos(Chart: any) {
    const ctx = document.getElementById('chartInsumos') as HTMLCanvasElement;
    if (!ctx || !this.datos) return;

    const labels = this.datos.insumosMasUtilizados.map(i => i.nombre);
    const data = this.datos.insumosMasUtilizados.map(i => i.vecesUtilizado);

    this.chartInsumos = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Veces Utilizado',
          data: data,
          backgroundColor: '#4facfe',
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
            tooltip: {
            callbacks: {
                label: (context: TooltipItem<'bar'>) => {
                const insumo = this.datos!.insumosMasUtilizados[context.dataIndex];
                return [
                    `Veces usado: ${context.parsed.x}`,
                    `Tipo: ${insumo.tipo}`,
                    `Disponible: ${insumo.disponible}`
                ];
                }
            }
            }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  crearGraficoDificultad(Chart: any) {
    const ctx = document.getElementById('chartDificultad') as HTMLCanvasElement;
    if (!ctx || !this.datos) return;

    const labels = this.datos.preparacionesPorDificultad.map(d => d.dificultad);
    const data = this.datos.preparacionesPorDificultad.map(d => d.preparaciones);

    const coloresPorDificultad: any = {
      'Facil': '#4caf50',
      'Media': '#ff9800',
      'Dificil': '#f44336',
      'Experto': '#9c27b0'
    };

    const colores = labels.map(label => coloresPorDificultad[label] || '#999');

    this.chartDificultad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colores,
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
            tooltip: {
            callbacks: {
                label: (context: TooltipItem<'pie'>) => {
                const total = data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
            }
            }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.chartCocteles) this.chartCocteles.destroy();
    if (this.chartInsumos) this.chartInsumos.destroy();
    if (this.chartDificultad) this.chartDificultad.destroy();
  }
}