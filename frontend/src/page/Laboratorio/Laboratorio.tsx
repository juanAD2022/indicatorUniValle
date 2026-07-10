import { useEffect, useState, useCallback } from 'react';
import { IndicatorCard } from '@components/IndicatorCard';
import { TrendLineChart } from '@components/TrendLineChart';
import { GenderPieChart } from '@components/GenderPieChart';
import { StatusBarChart } from '@components/StatusBarChart';
import { BaseLaboratorioTable } from '@components/BaseLaboratorioTable';
import {
  getBaseLaboratorioIndicators,
  getBaseLaboratorioStats,
  getBaseLaboratorioTrendData,
  getBaseLaboratorioUserDistribution,
} from '@services/baseLaboratorio';
import type {
  BaseLaboratorio,
  BaseLaboratorioStats,
  BaseLaboratorioTrendDataPoint,
  BaseLaboratorioUserDistribution,
} from '@models/BaseLaboratorio';
import { usePeriod } from '@context/usePeriod';
import {
  Users,
  ClipboardList,
  CheckCircle,
  Monitor,
  AlertTriangle,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Award,
} from 'lucide-react';

export const Laboratorio = () => {
  const [data, setData] = useState<BaseLaboratorio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedPeriod, setAvailablePeriods } = usePeriod();

  const [stats, setStats] = useState<BaseLaboratorioStats>({
    usuarios_totales: 0,
    servicios_solicitados: 0,
    servicios_atendidos: 0,
    equipos_disponibles: 0,
    incidentes: 0,
    tasa_atencion: 0,
    disponibilidad_equipos: 0,
    incidentes_por_100: 0,
    satisfaccion_promedio: 0,
    promedio_horas_uso: 0,
  });

  const [trendData, setTrendData] = useState<BaseLaboratorioTrendDataPoint[]>([]);

  const [userDistribution, setUserDistribution] = useState<BaseLaboratorioUserDistribution>({
    estudiantes: 0,
    profesores: 0,
    externos: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getBaseLaboratorioIndicators();
      setData(result);
      const periods = [...new Set(result.map((d) => d.periodo))].sort().reverse();
      setAvailablePeriods(periods);
    } catch {
      setError('Error al cargar los indicadores de laboratorio.');
    } finally {
      setIsLoading(false);
    }
  }, [setAvailablePeriods]);

  const fetchStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getBaseLaboratorioStats(periodo ?? undefined);
      setStats(result);
    } catch {
      // Silenciar error
    }
  }, []);

  const fetchTrendData = useCallback(async () => {
    try {
      const result = await getBaseLaboratorioTrendData();
      // Adaptar datos para TrendLineChart (que espera matriculados, graduados, desertores)
      const adapted = result.map((d) => ({
        periodo: d.periodo,
        matriculados: d.servicios_solicitados,
        graduados: d.servicios_atendidos,
        desertores: 0,
      }));
      setTrendData(adapted as BaseLaboratorioTrendDataPoint[]);
    } catch {
      // Silenciar error
    }
  }, []);

  const fetchUserDistribution = useCallback(async (periodo: string | null) => {
    try {
      const result = await getBaseLaboratorioUserDistribution(periodo ?? undefined);
      setUserDistribution(result);
    } catch {
      // Silenciar error
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchTrendData();
  }, [fetchData, fetchTrendData]);

  useEffect(() => {
    fetchStats(selectedPeriod);
    fetchUserDistribution(selectedPeriod);
  }, [selectedPeriod, fetchStats, fetchUserDistribution]);

  // Calcular calidad de servicio basada en satisfacción
  const getCalidadServicio = (satisfaccion: number): string => {
    if (satisfaccion >= 4.5) return 'EXCELENTE';
    if (satisfaccion >= 4.0) return 'BUENO';
    if (satisfaccion >= 3.0) return 'REGULAR';
    return 'DEFICIENTE';
  };

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#CC1C1C]">
          Laboratorio – Escuela de Estadística
        </h2>
      </div>

      {/* Fila 1: Tarjetas resumen (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <IndicatorCard
          value={stats.usuarios_totales}
          label="USUARIOS TOTALES"
          subtitle="Total de usuarios"
          description={selectedPeriod || 'TODOS'}
          bgColor="#1565C0"
          icon={<Users className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.servicios_solicitados}
          label="SERVICIOS SOLICITADOS"
          subtitle="Solicitudes recibidas"
          description={selectedPeriod || 'TODOS'}
          bgColor="#4CAF50"
          icon={<ClipboardList className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.servicios_atendidos}
          label="SERVICIOS ATENDIDOS"
          subtitle="Solicitudes completadas"
          description={selectedPeriod || 'TODOS'}
          bgColor="#FF9800"
          icon={<CheckCircle className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={getCalidadServicio(stats.satisfaccion_promedio)}
          label="CALIDAD SERVICIO"
          subtitle={`Satisfacción: ${stats.satisfaccion_promedio.toFixed(2)}/5`}
          description={selectedPeriod || 'TODOS'}
          bgColor="#9C27B0"
          icon={<Star className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.equipos_disponibles}
          label="EQUIPOS DISPONIBLES"
          subtitle="Equipos operativos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#00ACC1"
          icon={<Monitor className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.incidentes}
          label="INCIDENTES"
          subtitle="Incidentes reportados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#CC1C1C"
          icon={<AlertTriangle className="h-16 w-16" strokeWidth={1.5} />}
        />
      </div>

      {/* Fila 2: Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
              Cumplimiento mensual de servicios
            </h3>
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No hay datos de tendencia disponibles.
              </div>
            ) : (
              <TrendLineChart data={trendData} />
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
              Distribución de usuarios ({selectedPeriod || 'Todos'})
            </h3>
            <GenderPieChart
              hombres={userDistribution.estudiantes}
              mujeres={userDistribution.profesores + userDistribution.externos}
            />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-[#CC1C1C]" />
                <span className="text-xs text-gray-700">Estudiantes ({userDistribution.estudiantes})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-[#1565C0]" />
                <span className="text-xs text-gray-700">Profesores ({userDistribution.profesores})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-[#4CAF50]" />
                <span className="text-xs text-gray-700">Externos ({userDistribution.externos})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
              Servicios solicitados vs. atendidos
            </h3>
            <StatusBarChart
              matriculados={stats.servicios_solicitados}
              graduados={stats.servicios_atendidos}
              desertores={0}
            />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-[#CC1C1C]" />
                <span className="text-xs text-gray-700">Solicitados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-[#1565C0]" />
                <span className="text-xs text-gray-700">Atendidos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fila 3: Tabla con import */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Resumen general por período
        </h3>
        <BaseLaboratorioTable
          data={data}
          isLoading={isLoading}
          onImportComplete={fetchData}
          selectedPeriod={selectedPeriod}
        />
      </div>

      {/* Fila 4: Indicadores destacados */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Indicadores destacados ({selectedPeriod || 'Todos'})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <IndicatorCard
            value={`${stats.tasa_atencion.toFixed(2)}%`}
            label="TASA DE ATENCIÓN"
            subtitle="Atendidos / Solicitados"
            description={selectedPeriod || 'TODOS'}
            bgColor="#1565C0"
            icon={<TrendingUp className="h-10 w-10" strokeWidth={1.5} />}
          />
          <IndicatorCard
            value={`${stats.disponibilidad_equipos.toFixed(2)}%`}
            label="DISPONIBILIDAD"
            subtitle="Equipos operativos"
            description={selectedPeriod || 'TODOS'}
            bgColor="#4CAF50"
            icon={<Shield className="h-10 w-10" strokeWidth={1.5} />}
          />
          <IndicatorCard
            value={`${stats.incidentes_por_100.toFixed(2)}`}
            label="INCIDENTES / 100 SERV."
            subtitle="Incidentes por cada 100 servicios"
            description={selectedPeriod || 'TODOS'}
            bgColor="#FF9800"
            icon={<AlertTriangle className="h-10 w-10" strokeWidth={1.5} />}
          />
          <IndicatorCard
            value={`${stats.satisfaccion_promedio.toFixed(2)}/5`}
            label="SATISFACCIÓN PROMEDIO"
            subtitle="Escala 1-5"
            description={selectedPeriod || 'TODOS'}
            bgColor="#9C27B0"
            icon={<Award className="h-10 w-10" strokeWidth={1.5} />}
          />
          <IndicatorCard
            value={`${stats.promedio_horas_uso.toFixed(2)}`}
            label="PROM. HORAS USO"
            subtitle="Horas promedio por servicio"
            description={selectedPeriod || 'TODOS'}
            bgColor="#00ACC1"
            icon={<Clock className="h-10 w-10" strokeWidth={1.5} />}
          />
        </div>
      </div>

      <div className="mt-8 mb-4 text-xs text-gray-500 text-center">
        Los indicadores se calculan con base en la información registrada en el sistema.
      </div>
    </>
  );
};
