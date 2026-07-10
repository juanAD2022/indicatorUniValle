import { useEffect, useState, useCallback } from 'react';
import { IndicatorCard } from '@components/IndicatorCard';
import { GenderPieChart } from '@components/GenderPieChart';
import { StatusBarChart } from '@components/StatusBarChart';
import { TrendLineChart } from '@components/TrendLineChart';
import { PosgradoIndicatorTable } from '@components/PosgradoIndicatorTable';
import { ProceedingsTable } from '@components/ProceedingsTable';
import {
  getPosgradoIndicators,
  getPosgradoIndicatorStats,
  getPosgradoGenderStats,
  getPosgradoTrendData,
  getPosgradoComputedStats,
} from '@services/posgradoIndicator';
import type {
  PosgradoIndicator,
  PosgradoIndicatorStats,
  PosgradoGenderStats,
  PosgradoTrendDataPoint,
  PosgradoComputedStats,
  PosgradoProgramType,
} from '@models/PosgradoIndicator';
import { usePeriod } from '@context/usePeriod';
import {
  Users,
  GraduationCap,
  UserX,
  Briefcase,
  Mic,
  BookOpen,
  Clock,
  UserMinus,
  Timer,
  Hourglass,
} from 'lucide-react';

type ProgramFilter = 'MAESTRIA' | 'ESPECIALIZACION';

const PROGRAM_FILTERS: { key: ProgramFilter; label: string }[] = [
  { key: 'MAESTRIA', label: 'Maestría' },
  { key: 'ESPECIALIZACION', label: 'Especialización' },
];

export const Posgrado = () => {
  const [data, setData] = useState<PosgradoIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProgramFilter>('MAESTRIA');
  const { selectedPeriod, setAvailablePeriods } = usePeriod();

  const [stats, setStats] = useState<PosgradoIndicatorStats>({
    matriculados: 0,
    graduados: 0,
    desertores: 0,
    promedio_acumulado: 0,
    empleados: 0,
    desempleados: 0,
    ponencias: 0,
    publicaciones: 0,
    proyectos_desarrollo: null,
    proyectos_finalizados: null,
  });

  const [genderStats, setGenderStats] = useState<PosgradoGenderStats>({
    hombres: 0,
    mujeres: 0,
  });

  const [trendData, setTrendData] = useState<PosgradoTrendDataPoint[]>([]);

  const [computedStats, setComputedStats] = useState<PosgradoComputedStats>({
    tasa_sobrepermanencia: 0,
    tasa_deserciones: 0,
    tasa_retirados_bra: 0,
    tasa_graduados_10: 0,
    tasa_graduados_mas_10: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getPosgradoIndicators(activeFilter as PosgradoProgramType);
      setData(result);
      const periods = [...new Set(result.map((d) => d.periodo))].sort().reverse();
      setAvailablePeriods(periods);
    } catch {
      setError('Error al cargar los indicadores de posgrado.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, setAvailablePeriods]);

  const fetchStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getPosgradoIndicatorStats(periodo ?? undefined, activeFilter as PosgradoProgramType);
      setStats(result);
    } catch {
      // Silenciar error
    }
  }, [activeFilter]);

  const fetchGenderStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getPosgradoGenderStats(periodo ?? undefined, activeFilter as PosgradoProgramType);
      setGenderStats(result);
    } catch {
      // Silenciar error
    }
  }, [activeFilter]);

  const fetchTrendData = useCallback(async () => {
    try {
      const result = await getPosgradoTrendData(activeFilter as PosgradoProgramType);
      setTrendData(result);
    } catch {
      // Silenciar error
    }
  }, [activeFilter]);

  const fetchComputedStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getPosgradoComputedStats(periodo ?? undefined, activeFilter as PosgradoProgramType);
      setComputedStats(result);
    } catch {
      // Silenciar error
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchData();
    fetchTrendData();
  }, [fetchData, fetchTrendData]);

  useEffect(() => {
    fetchStats(selectedPeriod);
    fetchGenderStats(selectedPeriod);
    fetchComputedStats(selectedPeriod);
  }, [selectedPeriod, fetchStats, fetchGenderStats, fetchComputedStats]);

  const handleFilterChange = (filter: ProgramFilter) => {
    setActiveFilter(filter);
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
        <h2 className="text-2xl font-bold text-[#CC1C1C]">Indicadores Estudiantiles - Posgrado</h2>
        <p className="text-gray-600 mt-1">
          Consulta y filtra los indicadores académicos de los programas de posgrado.
        </p>
      </div>

      {/* Filtro de tipo de programa */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {PROGRAM_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-[#CC1C1C] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fila 1: Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <IndicatorCard
          value={stats.matriculados}
          label="MATRICULADOS"
          subtitle="Estudiantes activos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#CC1C1C"
          icon={<Users className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.graduados}
          label="GRADUADOS"
          subtitle="Egresados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#1565C0"
          icon={<GraduationCap className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.desertores}
          label="DESERTORES"
          subtitle="Estudiantes desertores"
          description={selectedPeriod || 'TODOS'}
          bgColor="#E53935"
          icon={<UserX className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.empleados}
          label="EMPLEADOS"
          subtitle="Con empleo"
          description={selectedPeriod || 'TODOS'}
          bgColor="#4CAF50"
          icon={<Briefcase className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.ponencias}
          label="PONENCIAS"
          subtitle="Presentadas"
          description={selectedPeriod || 'TODOS'}
          bgColor="#FF9800"
          icon={<Mic className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.publicaciones}
          label="PUBLICACIONES"
          subtitle="Realizadas"
          description={selectedPeriod || 'TODOS'}
          bgColor="#9C27B0"
          icon={<BookOpen className="h-16 w-16" strokeWidth={1.5} />}
        />
      </div>

      {/* Fila 2: Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        <div className="lg:col-span-5">
          <TrendLineChart data={trendData} />
        </div>

        <div className="lg:col-span-4">
          <StatusBarChart
            matriculados={stats.matriculados}
            graduados={stats.graduados}
            desertores={stats.desertores}
          />
        </div>

        <div className="lg:col-span-3">
          <GenderPieChart
            hombres={genderStats.hombres}
            mujeres={genderStats.mujeres}
          />
        </div>
      </div>

      {/* Fila 3: Tabla + Indicadores Calculados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-7">
          <PosgradoIndicatorTable
            data={data}
            isLoading={isLoading}
            tipoPrograma={activeFilter}
            onImportComplete={fetchData}
            selectedPeriod={selectedPeriod}
          />
        </div>

        <div className="lg:col-span-5">
          <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
            Indicadores Calculados
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <IndicatorCard
              value={`${computedStats.tasa_sobrepermanencia.toFixed(1)}%`}
              label="SOBREPERMANENCIA"
              subtitle="Estudiantes con >10 semestres"
              description={selectedPeriod || "TODOS"}
              icon={<Clock className="h-16 w-16" strokeWidth={1.5} />}
            />

            <IndicatorCard
              value={`${computedStats.tasa_deserciones.toFixed(1)}%`}
              label="DESERCIONES"
              subtitle="Tasa de deserción"
              description={selectedPeriod || "TODOS"}
              icon={<UserX className="h-16 w-16" strokeWidth={1.5} />}
            />

            <IndicatorCard
              value={`${computedStats.tasa_retirados_bra.toFixed(1)}%`}
              label="RETIRADOS BRA"
              subtitle="Tasa de retiro BRA"
              description={selectedPeriod || "TODOS"}
              icon={<UserMinus className="h-16 w-16" strokeWidth={1.5} />}
            />

            <IndicatorCard
              value={`${computedStats.tasa_graduados_10.toFixed(1)}%`}
              label="GRADUADOS"
              subtitle="Graduados"
              description={selectedPeriod || "TODOS"}
              icon={<Timer className="h-16 w-16" strokeWidth={1.5} />}
            />

            <IndicatorCard
              value={`${computedStats.tasa_graduados_mas_10.toFixed(1)}%`}
              label="GRADUADOS >10 SEM"
              subtitle="Graduados en más de 10"
              description={selectedPeriod || "TODOS"}
              icon={<Hourglass className="h-16 w-16" strokeWidth={1.5} />}
            />
          </div>
        </div>
      </div>

      {/* Fila 4: Documentos */}
      <div className="mt-6">
        <ProceedingsTable categoryId={2} />
      </div>
    </>
  );
};
