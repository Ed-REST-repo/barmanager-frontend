import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Insumo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  constructor(private apiService: ApiService) {}

  obtenerTodos(): Observable<Insumo[]> {
    return this.apiService.get<Insumo[]>('/insumos');
  }

  obtenerBajoStock(): Observable<Insumo[]> {
    return this.apiService.get<Insumo[]>('/insumos/bajo-stock');
  }

  reponerStock(id: number, cantidad: number): Observable<any> {
    let a = this.apiService.post(`/insumos/${id}/reponer`, { cantidad });
    console.log(a)
    return a;
  }

  obtenerPorId(id: number): Observable<Insumo> {
    return this.apiService.get<Insumo>(`/insumos/${id}`);
  }
}