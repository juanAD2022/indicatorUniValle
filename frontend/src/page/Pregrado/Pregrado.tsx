import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@components/NavBar';
import { StudentIndicatorTable } from '@components/StudentIndicatorTable';
import { getStudentIndicators } from '@services/studentIndicator';
import type { StudentIndicator } from '@models/StudentIndicator';

export const Pregrado = () => {
  const [data, setData] = useState<StudentIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <StudentIndicatorTable data={data} isLoading={isLoading} onImportComplete={fetchData} />

        )}
      </main>
    </div>
  );
};
