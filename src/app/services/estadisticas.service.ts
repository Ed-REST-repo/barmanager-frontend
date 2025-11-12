import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CoctelEstadistica, InsumoEstadistica, DificultadEstadistica, ResumenGeneral } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  
  constructor(private apiService: ApiService) {}

  obtenerCoctelesMasPreparados(limite: number = 10): Observable<CoctelEstadistica[]> {
    return this.apiService.get<CoctelEstadistica[]>(
      `/v2/estadisticas/cocteles-mas-preparados?limite=${limite}`
    );
  }

  obtenerInsumosMasUtilizados(limite: number = 10): Observable<InsumoEstadistica[]> {
    return this.apiService.get<InsumoEstadistica[]>(
      `/v2/estadisticas/insumos-mas-utilizados?limite=${limite}`
    );
  }

  obtenerPreparacionesPorDificultad(): Observable<DificultadEstadistica[]> {
    return this.apiService.get<DificultadEstadistica[]>(
      '/v2/estadisticas/preparaciones-por-dificultad'
    );
  }

  obtenerResumenGeneral(): Observable<ResumenGeneral> {
    return this.apiService.get<ResumenGeneral>('/v2/estadisticas/resumen-general');
  }
}