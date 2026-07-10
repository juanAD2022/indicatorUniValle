import { useEffect, useState, useCallback } from 'react';
import { IndicatorCard } from '@components/IndicatorCard';
import { GenderPieChart } from '@components/GenderPieChart';
import { StatusBarChart } from '@components/StatusBarChart';
import { TrendLineChart } from '@components/TrendLineChart';
import { RecentDocumentsCard } from '@components/RecentDocumentsCard';
import { AlertsSummaryCard } from '@components/AlertsSummaryCard';
import { QuickAccessCard } from '@components/QuickAccessCard';
import type { QuickLink } from '@components/QuickAccessCard';
import { getDashboardStats } from '@services/dashboard';
import type { DashboardStats } from '@services/dashboard';
import { getStudentIndicatorStats, getGenderStats, getTrendData } from '@services/studentIndicator';
import type { StudentIndicatorStats, GenderStats, TrendDataPoint } from '@services/studentIndicator';
import { usePeriod } from '@context/usePeriod';
import {
  Users,
  GraduationCap,
  FlaskConical,
  FileText,
  BookOpen,
  School,
  UserPlus,
  Upload,
  Database,
  FileBarChart,
} from 'lucide-react';

type ProgramFilter = 'TODOS' | 'PREGRADO' | 'ESPECIALIZACION' | 'MAESTRIA';

const PROGRAM_FILTERS: { key: ProgramFilter; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PREGRADO', label: 'Pregrado' },
  { key: 'ESPECIALIZACION', label: 'Especialización' },
  { key: 'MAESTRIA', label: 'Maestría' },
];

const QUICK_LINKS: QuickLink[] = [
  { label: 'Registrar profesor', path: '/gestion-directiva', icon: <UserPlus className="h-5 w-5" /> },
  { label: 'Cargar documento', path: '/carga-documentos', icon: <Upload className="h-5 w-5" /> },
  { label: 'Cargar base de datos', path: '/carga-bd', icon: <Database className="h-5 w-5" /> },
  { label: 'Ver reportes', path: '/reportes', icon: <FileBarChart className="h-5 w-5" /> },
];

export const Dashboard = () => {
  const { selectedPeriod } = usePeriod();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProgramFilter>('TODOS');

  const [statsByType, setStatsByType] = useState<StudentIndicatorStats>({
    matriculados: 0,
    graduados: 0,
    reingresados: 0,
    por_amnistia: 0,
    retirados: 0,
    desertores: 0,
  });
  const [genderStats, setGenderStats] = useState<GenderStats>({ hombres: 0, mujeres: 0 });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getDashboardStats(selectedPeriod ?? undefined);
      setStats(result);
    } catch {
      setError('Error al cargar las estadísticas del dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  const fetchProgramData = useCallback(async (filter: ProgramFilter) => {
    try {
      const tipoPrograma = filter === 'TODOS' ? undefined : filter;
      const [s, g, t] = await Promise.all([
        getStudentIndicatorStats(selectedPeriod ?? undefined, tipoPrograma),
        getGenderStats(selectedPeriod ?? undefined, tipoPrograma),
        getTrendData(tipoPrograma),
      ]);
      setStatsByType(s);
      setGenderStats(g);
      setTrendData(t);
    } catch {
      // Silenciar error
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  useEffect(() => {
    fetchProgramData(activeFilter);
  }, [activeFilter, fetchProgramData]);

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
      {/* Fila 1: Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <IndicatorCard
          value={stats?.estudiantes_activos_total ?? (isLoading ? '...' : 0)}
          label="ESTUDIANTES ACTIVOS"
          subtitle="Pregrado / Posgrado / Maestría"
          description={selectedPeriod || 'TODOS'}
          bgColor="#CC1C1C"
          icon={<Users className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats?.profesores ?? 0}
          label="PROFESORES"
          subtitle="Total registrados"
          description="Por registrar"
          bgColor="#1565C0"
          icon={<GraduationCap className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats?.usuarios_laboratorio ?? 0}
          label="USUARIOS LABORATORIO"
          subtitle="Período actual"
          description="Por registrar"
          bgColor="#4CAF50"
          icon={<FlaskConical className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats?.documentos ?? 0}
          label="DOCUMENTOS"
          subtitle="En el sistema"
          description="Cargados"
          bgColor="#FF9800"
          icon={<FileText className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats?.publicaciones ?? 0}
          label="PUBLICACIONES"
          subtitle="Realizadas"
          description="Por registrar"
          bgColor="#9C27B0"
          icon={<BookOpen className="h-16 w-16" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats?.cursos_extension ?? 0}
          label="CURSOS EXTENSIÓN"
          subtitle="Diplomados ofrecidos"
          description="Por registrar"
          bgColor="#E53935"
          icon={<School className="h-16 w-16" strokeWidth={1.5} />}
        />
      </div>

      {/* Fila 2: Selector de tipo de programa */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-3">
          Indicadores Estudiantiles — Filtro por programa
        </h3>
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

      {/* Fila 3: Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        <div className="lg:col-span-5">
          <TrendLineChart data={trendData} />
        </div>

        <div className="lg:col-span-4">
          <StatusBarChart
            matriculados={statsByType.matriculados}
            graduados={statsByType.graduados}
            desertores={statsByType.desertores}
          />
        </div>

        <div className="lg:col-span-3">
          <GenderPieChart
            hombres={genderStats.hombres}
            mujeres={genderStats.mujeres}
          />
        </div>
      </div>

      {/* Fila 4: Resúmenes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <RecentDocumentsCard />
        <AlertsSummaryCard />
        <QuickAccessCard links={QUICK_LINKS} />
      </div>
    </>
  );
};
