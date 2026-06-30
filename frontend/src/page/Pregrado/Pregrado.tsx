import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@components/NavBar';
import { IndicatorCard } from '@components/IndicatorCard';
import { StudentIndicatorTable } from '@components/StudentIndicatorTable';
import { GenderPieChart } from '@components/GenderPieChart';
import { StatusBarChart } from '@components/StatusBarChart';
import { TrendLineChart } from '@components/TrendLineChart';
import { ProceedingsTable } from '@components/ProceedingsTable';
import { getStudentIndicators, getStudentIndicatorStats, getGenderStats, getTrendData, getComputedStats } from '@services/studentIndicator';
import type { StudentIndicator } from '@models/StudentIndicator';
import type { StudentIndicatorStats, GenderStats, TrendDataPoint, ComputedStats } from '@services/studentIndicator';
import { Users, GraduationCap, UserCheck, Heart, Clock, BookOpen, UserMinus, Timer, Hourglass } from 'lucide-react';

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
  const [computedStats, setComputedStats] = useState<ComputedStats>({
    tasa_sobrepermanencia: 0,
    promedio_tesis: 0,
    tasa_retirados_bra: 0,
    tasa_graduados_10: 0,
    tasa_graduados_mas_10: 0,
  });

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

  const fetchComputedStats = useCallback(async (periodo: string | null) => {
    try {
      const result = await getComputedStats(periodo ?? undefined);
      setComputedStats(result);
    } catch {
      // Silenciar error de computed stats
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchTrendData();
  }, [fetchData, fetchTrendData]);

  useEffect(() => {
    fetchStats(selectedPeriod);
    fetchGenderStats(selectedPeriod);
    fetchComputedStats(selectedPeriod);
  }, [selectedPeriod, fetchStats, fetchGenderStats, fetchComputedStats]);

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

            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
                Indicadores Calculados
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <IndicatorCard
                  value={`${computedStats.tasa_sobrepermanencia.toFixed(1)}%`}
                  label="SOBREPERMANENCIA"
                  subtitle="Estudiantes con >10 semestres"
                  description={selectedPeriod || "TODOS"}
                  icon={<Clock className="h-16 w-16" strokeWidth={1.5} />}
                />

                <IndicatorCard
                  value={computedStats.promedio_tesis.toFixed(2)}
                  label="PROMEDIO TESIS"
                  subtitle="Nota promedio aprobadas"
                  description={selectedPeriod || "TODOS"}
                  icon={<BookOpen className="h-16 w-16" strokeWidth={1.5} />}
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

            <div className="mt-6">
              <ProceedingsTable categoryId={1} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};
