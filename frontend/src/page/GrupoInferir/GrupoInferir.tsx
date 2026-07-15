import { useEffect, useState, useCallback } from 'react';
import { IndicatorCard } from '@components/IndicatorCard';
import { PonenciasTrendChart } from '@components/PonenciasTrendChart';
import { ProjectsPieChart } from '@components/ProjectsPieChart';
import { ConvocationsBarChart } from '@components/ConvocationsBarChart';
import { ResearchLinesChart } from '@components/ResearchLinesChart';
import { ParticipationPercentages } from '@components/ParticipationPercentages';
import { GrupoInferirTable } from '@components/GrupoInferirTable';
import { InvestigatorsTable } from '@components/InvestigatorsTable';
import { ProductionTable } from '@components/ProductionTable';
import { FinancingTable } from '@components/FinancingTable';
import {
  getGrupoInferirIndicators,
  getGrupoInferirStats,
  getGrupoInferirTrendData,
  getGrupoInferirFinancingStats,
  getGrupoInferirLinesStats,
  getGrupoInferirParticipationStats,
} from '@services/grupoInferirIndicator';
import type {
  GrupoInferirIndicator,
  GrupoInferirIndicatorStats,
  GrupoInferirTrendDataPoint,
  GrupoInferirFinancingStats,
  GrupoInferirLinesStats,
  GrupoInferirParticipationStats,
} from '@models/GrupoInferirIndicator';
import { usePeriod } from '@context/usePeriod';
import {
  Users,
  UserSearch,
  Monitor,
  UserCheck,
  FolderOpen,
} from 'lucide-react';

export const GrupoInferir = () => {
  const [data, setData] = useState<GrupoInferirIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedPeriod, setAvailablePeriods } = usePeriod();

  const [stats, setStats] = useState<GrupoInferirIndicatorStats>({
    profesores_vinculados: 0,
    jovenes_investigadores: 0,
    monitores: 0,
    asistentes_investigacion: 0,
    proyectos_desarrollo: 0,
    proyectos_finalizados: 0,
    proyectos_cancelados: 0,
    ponencias_nacionales: 0,
    ponencias_internacionales: 0,
    revistas_nacionales: 0,
    revistas_internacionales: 0,
    publicaciones_eventos: 0,
    libros: 0,
    proyectos_id: 0,
    informes_investigacion: 0,
  });

  const [trendData, setTrendData] = useState<GrupoInferirTrendDataPoint[]>([]);
  const [financingStats, setFinancingStats] = useState<GrupoInferirFinancingStats>({
    colciencias: 0,
    univalle: 0,
    otros: 0,
  });
  const [linesStats, setLinesStats] = useState<GrupoInferirLinesStats>({
    regresion: 0,
    bioestadistica: 0,
    analisis_datos: 0,
    control_estadistico: 0,
  });
  const [participationStats, setParticipationStats] = useState<GrupoInferirParticipationStats>({
    pregrado: 0,
    especializacion: 0,
    maestria: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getGrupoInferirIndicators();
      setData(result);
      const periods = [...new Set(result.map((d) => d.periodo))].sort().reverse();
      setAvailablePeriods(periods);
    } catch {
      setError('Error al cargar los indicadores del grupo inferir.');
    } finally {
      setIsLoading(false);
    }
  }, [setAvailablePeriods]);

  const fetchStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getGrupoInferirStats(periodo ?? undefined);
      setStats(result);
    } catch {
      // Silenciar error
    }
  }, []);

  const fetchTrendData = useCallback(async () => {
    try {
      const result = await getGrupoInferirTrendData();
      setTrendData(result);
    } catch {
      // Silenciar error
    }
  }, []);

  const fetchFinancingStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getGrupoInferirFinancingStats(periodo ?? undefined);
      setFinancingStats(result);
    } catch {
      // Silenciar error
    }
  }, []);

  const fetchLinesStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getGrupoInferirLinesStats(periodo ?? undefined);
      setLinesStats(result);
    } catch {
      // Silenciar error
    }
  }, []);

  const fetchParticipationStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getGrupoInferirParticipationStats(periodo ?? undefined);
      setParticipationStats(result);
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
    fetchFinancingStats(selectedPeriod);
    fetchLinesStats(selectedPeriod);
    fetchParticipationStats(selectedPeriod);
  }, [selectedPeriod, fetchStats, fetchFinancingStats, fetchLinesStats, fetchParticipationStats]);

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  const totalProyectos = stats.proyectos_desarrollo + stats.proyectos_finalizados + stats.proyectos_cancelados;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#CC1C1C]">
          ¡Bienvenido! <br />
          GRUPO INFERIR – Escuela de Estadística
        </h2>
      </div>

      {/* Fila 1: Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <IndicatorCard
          value={stats.profesores_vinculados}
          label="PROFESORES"
          subtitle="Vinculados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#1565C0"
          icon={<Users className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.jovenes_investigadores}
          label="JÓVENES"
          subtitle="Investigadores"
          description={selectedPeriod || 'TODOS'}
          bgColor="#4CAF50"
          icon={<UserSearch className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.monitores}
          label="MONITORES"
          subtitle="Asignados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#FF9800"
          icon={<Monitor className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.asistentes_investigacion}
          label="ASISTENTES"
          subtitle="De investigación"
          description={selectedPeriod || 'TODOS'}
          bgColor="#9C27B0"
          icon={<UserCheck className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={totalProyectos}
          label="PROYECTOS"
          subtitle="De investigación"
          description={selectedPeriod || 'TODOS'}
          bgColor="#CC1C1C"
          icon={<FolderOpen className="h-16 w-16" strokeWidth={1.5} />}
        />
      </div>

      {/* Fila 2: Tendencia ponencias + Proyectos por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-7">
          <PonenciasTrendChart data={trendData} />
        </div>

        <div className="lg:col-span-5">
          <ProjectsPieChart
            desarrollo={stats.proyectos_desarrollo}
            finalizados={stats.proyectos_finalizados}
            cancelados={stats.proyectos_cancelados}
          />
        </div>
      </div>

      {/* Fila 3: Convocatorias + Líneas investigación + Participación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-4">
          <ConvocationsBarChart
            internas={data.reduce((sum, r) => sum + r.convocatorias_internas, 0)}
            externas={data.reduce((sum, r) => sum + r.convocatorias_externas, 0)}
            profesorales={data.reduce((sum, r) => sum + r.convocatorias_profesorales, 0)}
          />
        </div>

        <div className="lg:col-span-4">
          <ResearchLinesChart
            regresion={linesStats.regresion}
            bioestadistica={linesStats.bioestadistica}
            analisis_datos={linesStats.analisis_datos}
            control_estadistico={linesStats.control_estadistico}
          />
        </div>

        <div className="lg:col-span-4">
          <ParticipationPercentages
            pregrado={participationStats.pregrado}
            especializacion={participationStats.especializacion}
            maestria={participationStats.maestria}
          />
        </div>
      </div>

      {/* Fila 4: Tablas inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <InvestigatorsTable data={data} />
        <ProductionTable data={data} />
        <FinancingTable stats={financingStats} />
      </div>

      {/* Fila 5: Tabla completa de datos */}
      <div className="mt-6">
        <GrupoInferirTable
          data={data}
          isLoading={isLoading}
          onImportComplete={fetchData}
          selectedPeriod={selectedPeriod}
        />
      </div>
    </>
  );
};
