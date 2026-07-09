export interface Alert {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: 'REPORTE' | 'ALERTA';
  estado: 'PENDIENTE' | 'FINALIZADO';
  fecha_inicio: string;
  fecha_fin: string | null;
  user_id: number;
  created_at: string;
}

export interface AlertFilters {
  search?: string;
  tipo?: string;
  estado?: string;
}
