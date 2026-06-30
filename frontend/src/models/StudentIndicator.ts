export interface StudentIndicator {
  id: number;
  periodo: string;
  estado: string;
  vinculacion: string;
  bra: number;
  semestres_cursados: string;
  pensum_aprobado_pct: number;
  promedio_acumulado: number;
  colegio_origen: string;
  sexo: string;
  estrato: number;
  tesis_estado: string;
  tesis_nota: number | null;
  acompanamiento_bra: boolean;
  practica_profesional: boolean;
}

export interface StudentIndicatorFilters {
  periodo?: string;
  estado?: string;
  sexo?: string;
  estrato?: number;
  search?: string;
}
