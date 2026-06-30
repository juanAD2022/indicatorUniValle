import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@components/NavBar';
import { IndicatorCard } from '@components/IndicatorCard';
import { StudentIndicatorTable } from '@components/StudentIndicatorTable';
import { GenderPieChart } from '@components/GenderPieChart';
import { StatusBarChart } from '@components/StatusBarChart';
import { TrendLineChart } from '@components/TrendLineChart';
import { getStudentIndicators, getStudentIndicatorStats, getGenderStats, getTrendData } from '@services/studentIndicator';
import type { StudentIndicator } from '@models/StudentIndicator';
import type { StudentIndicatorStats, GenderStats, TrendDataPoint } from '@services/studentIndicator';
import { Users, GraduationCap, UserCheck, Heart } from 'lucide-react';

export const Pregrado = () => {
  const [data, setData] = useState<StudentIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [stats, setStats] = useState<StudentIndicatorStats>({
    matriculados: 0,
    graduados: 0,
    reingresados: 0,
    por_amnistia: 0,
  });
  const [genderStats, setGenderStats] = useState<GenderStats>({
    hombres: 0,
    mujeres: 0,
  });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getStudentIndicators();
      setData(result);
    } catch {
      setError('Error al cargar los indicadores estudiantiles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getStudentIndicatorStats(periodo ?? undefined);
      setStats(result);
    } catch {
      // Silenciar error de stats
    }
  }, []);

  const fetchGenderStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getGenderStats(periodo ?? undefined);
      setGenderStats(result);
    } catch {
      // Silenciar error de gender stats
    }
  }, []);

  const fetchTrendData = useCallback(async () => {
    try {
      const result = await getTrendData();
      setTrendData(result);
    } catch {
      // Silenciar error de trend data
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchTrendData();
  }, [fetchData, fetchTrendData]);

  useEffect(() => {
    fetchStats(selectedPeriod);
    fetchGenderStats(selectedPeriod);
  }, [selectedPeriod, fetchStats, fetchGenderStats]);

  const handlePeriodChange = (periodo: string | null) => {
    setSelectedPeriod(periodo);
  };

  return (
    <div className="min-h-screen bg-[#E8E8F0]">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#CC1C1C]">Indicadores Estudiantiles - Pregrado</h2>
          <p className="text-gray-600 mt-1">
            Consulta y filtra los indicadores académicos de los estudiantes de pregrado.
          </p>
        </div>

        {error ? (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center text-red-600">{error}</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <IndicatorCard
                value={stats.matriculados}
                label="MATRICULADOS"
                subtitle="Estudiantes activos"
                description="PERIODO ACTUAL"
                icon={<Users className="h-16 w-16" strokeWidth={1.5} />}
              />
              <IndicatorCard
                value={stats.graduados}
                label="GRADUADOS"
                subtitle="Egresados"
                description="PERIODO ACTUAL"
                icon={<GraduationCap className="h-16 w-16" strokeWidth={1.5} />}
              />
              <IndicatorCard
                value={stats.reingresados}
                label="REINGRESADOS"
                subtitle="Volvieron a matricularse"
                description="PERIODO ACTUAL"
                icon={<UserCheck className="h-16 w-16" strokeWidth={1.5} />}
              />
              <IndicatorCard
                value={stats.por_amnistia}
                label="POR AMNISTIA"
                subtitle="Amnistía académica"
                description="PERIODO ACTUAL"
                icon={<Heart className="h-16 w-16" strokeWidth={1.5} />}
              />
            </div>

            <StudentIndicatorTable
              data={data}
              isLoading={isLoading}
              onImportComplete={fetchData}
              onPeriodChange={handlePeriodChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <GenderPieChart
                hombres={genderStats.hombres}
                mujeres={genderStats.mujeres}
              />
              <StatusBarChart
                matriculados={stats.matriculados}
                graduados={stats.graduados}
                reingresados={stats.reingresados}
                por_amnistia={stats.por_amnistia}
              />
            </div>

            <div className="mt-6">
              <TrendLineChart data={trendData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};
