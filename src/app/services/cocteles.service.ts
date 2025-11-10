import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CoctelDisponibilidad, CoctelDetallado } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CoctelesService {
  constructor(private apiService: ApiService) {}

  obtenerDisponibles(): Observable<CoctelDisponibilidad[]> {
    return this.apiService.get<CoctelDisponibilidad[]>(
      '/v2/cocteles/disponibles?soloDisponibles=false&incluirConSustituciones=true'
    );
  }

  obtenerDetalle(id: number): Observable<CoctelDetallado> {
    return this.apiService.get<CoctelDetallado>(`/v2/cocteles/${id}/receta-detallada`);
  }

  prepararCoctel(coctelId: number, bartenderId: number): Observable<any> {
    return this.apiService.post(`/v2/cocteles/${coctelId}/preparar`, {
      bartenderId,
      permitirSustituciones: true
    });
  }
}