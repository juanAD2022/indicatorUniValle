import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Upload, Mic, BookOpen, Award, Wrench, Briefcase } from 'lucide-react';
import { IndicatorCard } from '@components/IndicatorCard';
import { TrendsLineChart } from '@components/TrendsLineChart';
import { ActivitiesDonutChart } from '@components/ActivitiesDonutChart';
import { IncomeChart } from '@components/IncomeChart';
import { ExtensionSocialTable } from '@components/ExtensionSocialTable';
import { ParticipationCards } from '@components/ParticipationCards';
import { AverageCards } from '@components/AverageCards';
import { ImportPreviewModal } from '@components/ImportPreviewModal';
import { uploadPreview, confirmImport } from '@services/studentIndicator/importService';
import type { ImportPreview } from '@services/studentIndicator/importService';
import {
  getExtensionSocial,
  getExtensionSocialStats,
} from '@services/extensionSocial';
import type {
  ExtensionSocial,
  ExtensionSocialStats,
  ActivitiesChartData,
} from '@models/ExtensionSocial';
import { usePeriod } from '@context/usePeriod';

export const ExtensionEducacion = () => {
  const { selectedPeriod, setAvailablePeriods } = usePeriod();

  // Data states
  const [data, setData] = useState<ExtensionSocial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats states
  const [stats, setStats] = useState<ExtensionSocialStats>({
    total_registros: 0,
    total_conferencias: 0,
    total_cursos: 0,
    total_diplomados: 0,
    total_talleres: 0,
    total_consultorias: 0,
    total_asistentes: 0,
    total_horas: 0,
    total_participacion_estudiantil: 0,
    total_participacion_egresados: 0,
    total_participacion_profesores: 0,
    total_ingreso_neto: 0,
    promedio_ingreso_neto: 0,
  });

  // Import states
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch functions
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [extensionData, extensionStats] = await Promise.all([
        getExtensionSocial(selectedPeriod ?? undefined),
        getExtensionSocialStats(selectedPeriod ?? undefined),
      ]);
      setData(extensionData);
      setStats(extensionStats);

      // Set available periods
      const allPeriods = [...new Set(extensionData.map((d) => d.periodo))].sort().reverse();
      setAvailablePeriods(allPeriods);
    } catch {
      setError('Error al cargar los datos de extensión social.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, setAvailablePeriods]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Computed chart data
  const trendsChartData: ActivitiesChartData[] = useMemo(() => {
    return data.map((d) => ({
      periodo: d.periodo,
      conferencias: d.conferencias_dictadas,
      cursos: d.cursos_ofrecidos,
      diplomados: d.diplomados_ofrecidos,
      talleres: d.talleres_ofrecidos,
      consultorias: d.consultorias,
    }));
  }, [data]);

  const incomeChartData = useMemo(() => {
    return data
      .slice()
      .sort((a, b) => a.periodo.localeCompare(b.periodo))
      .map((d) => ({
        periodo: d.periodo,
        ingreso_neto: d.ingreso_neto,
      }));
  }, [data]);

  // Import handlers
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImportSuccess(null);

    try {
      const preview = await uploadPreview(file, 'EXTENSION_SOCIAL');
      setImportPreview(preview);
      setShowModal(true);
    } catch {
      alert('Error al procesar el archivo. Verifique que el formato sea correcto.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);
    try {
      const result = await confirmImport(importPreview.pending_rows, 'EXTENSION_SOCIAL');
      setShowModal(false);
      setImportPreview(null);
      setImportSuccess(result.message);
      fetchAllData();
    } catch {
      alert('Error al ejecutar la importación.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setShowModal(false);
    setImportPreview(null);
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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#CC1C1C]">
          Extensión Social – Escuela de Estadística
        </h2>
      </div>

      {/* Import button + success message */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Subiendo...' : 'Importar Excel'}
        </button>
        {importSuccess && (
          <span className="text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
            {importSuccess}
          </span>
        )}
      </div>

      <ImportPreviewModal
        isOpen={showModal}
        preview={importPreview}
        isLoading={isImporting}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />

      {/* KPIs row - 5 IndicatorCards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <IndicatorCard
          value={stats.total_cursos}
          label="CURSOS"
          subtitle="Total cursos ofrecidos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#9C27B0"
          icon={<BookOpen className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.total_diplomados}
          label="DIPLOMADOS"
          subtitle="Total diplomados ofrecidos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#4CAF50"
          icon={<Award className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.total_consultorias}
          label="CONSULTORÍAS"
          subtitle="Total consultorías"
          description={selectedPeriod || 'TODOS'}
          bgColor="#E91E63"
          icon={<Briefcase className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.total_conferencias}
          label="CONFERENCIAS"
          subtitle="Total conferencias dictadas"
          description={selectedPeriod || 'TODOS'}
          bgColor="#1565C0"
          icon={<Mic className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={stats.total_talleres}
          label="TALLERES"
          subtitle="Total talleres ofrecidos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#FF9800"
          icon={<Wrench className="h-10 w-10" strokeWidth={1.5} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TrendsLineChart data={trendsChartData} />
        <ActivitiesDonutChart stats={stats} />
        <IncomeChart data={incomeChartData} />
      </div>

      {/* Bottom section: Table + Participation + Averages */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <ExtensionSocialTable
            data={data}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
          />
        </div>
        <ParticipationCards stats={stats} />
        <AverageCards stats={stats} data={data} />
      </div>

      <div className="mt-8 mb-4 text-xs text-gray-500 text-center">
        Los indicadores se calculan con base en la información registrada en el sistema.
      </div>
    </>
  );
};
