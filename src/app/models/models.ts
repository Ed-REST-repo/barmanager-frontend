export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  rol: 'BARTENDER' | 'ADMINISTRADOR';
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  usuario: string;
}

export interface CoctelDisponibilidad {
  coctelId: number;
  nombreCoctel: string;
  descripcion: string;
  categoria: string;
  dificultad: string;
  estado: 'DISPONIBLE' | 'PREPARABLE_CON_SUSTITUCIONES' | 'NO_DISPONIBLE';
  ingredientesDisponibles: number;
  ingredientesTotales: number;
  porcentajeDisponibilidad: number;
  insumosFaltantes: string[];
  tieneSustituciones: boolean;
}

export interface CoctelDetallado {
  coctel: Coctel;
  ingredientes: IngredienteDetalle[];
  pasos: PasoPreparacion[];
  preparable: boolean;
  sustituciones: SustitucionSugerida[];
  nivelAlcohol: string;
  nivelCalorico: string;
  tiempoPreparacion: number;
  costoEstimado: number;
}

export interface Coctel {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  dificultad: string;
  vaso: string;
  hielo: string;
}

export interface IngredienteDetalle {
  nombreInsumo: string;
  cantidad: number;
  unidad: string;
  disponible: boolean;
  cantidadDisponible: number;
  esOpcional: boolean;
  notas: string;
}

export interface PasoPreparacion {
  id: number;
  orden: number;
  descripcion: string;
  duracionSegundos: number;
}

export interface SustitucionSugerida {
  insumoOriginal: string;
  insumoSustituto: string;
  cantidadNecesaria: number;
  unidad: string;
  calidadSustitucion: number;
  notas: string;
}

export interface Insumo {
  id: number;
  nombre: string;
  tipo: string;
  cantidadDisponible: number;
  cantidadMinima: number;
  precio: number;
  unidad: {
    nombre: string;
    abreviatura: string;
  };
  proveedor?: {
    nombre: string;
  };
  fechaVencimiento?: string;
}

export interface InsumosBajoStock {
  id: number;
  nombre: string;
  tipo: string;
  cantidadDisponible: number;
  cantidadMinima: number;
  faltante: number;
  precio: number;
  unidad: string;
}