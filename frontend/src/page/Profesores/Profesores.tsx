import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Briefcase,
  GraduationCap,
  BookOpen,
  Upload,
} from 'lucide-react';
import { ProfesorVariationChart } from '@components/ProfesorVariationChart';
import { ProfesorHoursChart } from '@components/ProfesorHoursChart';
import { ProfesorTable } from '@components/ProfesorTable';
import { ImportPreviewModal } from '@components/ImportPreviewModal';
import {
  getProfesores,
  getProfesorStats,
  getProfesoresActivos,
} from '@services/profesor';
import {
  uploadPreview,
  confirmImport,
} from '@services/studentIndicator/importService';
import type { ImportPreview } from '@services/studentIndicator/importService';
import type {
  Profesor,
  ProfesorStats,
  VariationChartData,
  HoursChartData,
  ProfesorActivo,
} from '@models/Profesor';
import { usePeriod } from '@context/usePeriod';

interface MiniKpiCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  percentage: number;
  color: string;
}

const MiniKpiCard = ({ icon, value, label, percentage, color }: MiniKpiCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
    <div
      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        <span className="text-xs font-medium text-gray-500">{percentage}%</span>
      </div>
      <p className="text-xs text-gray-500 truncate">{label}</p>
    </div>
  </div>
);

export const Profesores = () => {
  const { selectedPeriod, setAvailablePeriods } = usePeriod();

  const [data, setData] = useState<Profesor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profesoresActivos, setProfesoresActivos] = useState<ProfesorActivo[]>([]);
  const [isLoadingActivos, setIsLoadingActivos] = useState(true);

  const [stats, setStats] = useState<ProfesorStats>({
    total_registros: 0,
    total_planta: 0,
    total_contratistas: 0,
    total_asistentes: 0,
    total_comision: 0,
    total_horas_administrativo: 0,
    total_horas_docencia: 0,
    total_horas_extension: 0,
    total_horas_investigacion: 0,
    promedio_variacion_planta: 0,
    promedio_variacion_contratistas: 0,
    promedio_variacion_asistentes: 0,
    promedio_variacion_comision: 0,
  });

  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profesorData, profesorStats] = await Promise.all([
        getProfesores(selectedPeriod ?? undefined),
        getProfesorStats(selectedPeriod ?? undefined),
      ]);
      setData(profesorData);
      setStats(profesorStats);
      const allPeriods = [
        ...new Set(profesorData.map((d) => d.periodo)),
      ].sort().reverse();
      setAvailablePeriods(allPeriods);
    } catch {
      setError('Error al cargar los datos de profesores.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, setAvailablePeriods]);

  const fetchProfesoresActivos = useCallback(async () => {
    try {
      setIsLoadingActivos(true);
      const result = await getProfesoresActivos();
      setProfesoresActivos(result);
    } catch {
      // Silenciar error
    } finally {
      setIsLoadingActivos(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchProfesoresActivos();
  }, [fetchAllData, fetchProfesoresActivos]);

  // KPI calculations
  const totalProfesores = useMemo(() => {
    return stats.total_planta + stats.total_contratistas + stats.total_asistentes + stats.total_comision;
  }, [stats]);

  const kpiPercentages = useMemo(() => {
    const total = totalProfesores || 1;
    return {
      planta: Math.round((stats.total_planta / total) * 100),
      contratistas: Math.round((stats.total_contratistas / total) * 100),
      asistentes: Math.round((stats.total_asistentes / total) * 100),
      comision: Math.round((stats.total_comision / total) * 100),
    };
  }, [stats, totalProfesores]);

  // Chart data
  const variationChartData: VariationChartData[] = useMemo(() => {
    return data
      .slice()
      .sort((a, b) => a.periodo.localeCompare(b.periodo))
      .map((d) => ({
        periodo: d.periodo,
        planta: Number(d.variacion_planta),
        contratistas: Number(d.variacion_contratistas),
        asistentes: Number(d.variacion_asistentes),
        comision: Number(d.variacion_comision),
      }));
  }, [data]);

  const hoursChartData: HoursChartData[] = useMemo(() => {
    if (data.length === 0) return [];

    // If a specific period is selected, show that period's hours directly
    // If "Todos", show averages across all periods
    if (selectedPeriod) {
      const periodData = data.find((d) => d.periodo === selectedPeriod);
      if (periodData) {
        return [
          { categoria: 'Administración', horas: periodData.horas_administrativo },
          { categoria: 'Docencia', horas: periodData.horas_docencia },
          { categoria: 'Extensión', horas: periodData.horas_extension },
          { categoria: 'Investigación', horas: periodData.horas_investigacion },
        ];
      }
    }

    const count = data.length || 1;
    return [
      {
        categoria: 'Administración',
        horas: Math.round(
          data.reduce((sum, d) => sum + d.horas_administrativo, 0) / count
        ),
      },
      {
        categoria: 'Docencia',
        horas: Math.round(
          data.reduce((sum, d) => sum + d.horas_docencia, 0) / count
        ),
      },
      {
        categoria: 'Extensión',
        horas: Math.round(
          data.reduce((sum, d) => sum + d.horas_extension, 0) / count
        ),
      },
      {
        categoria: 'Investigación',
        horas: Math.round(
          data.reduce((sum, d) => sum + d.horas_investigacion, 0) / count
        ),
      },
    ];
  }, [data, selectedPeriod]);

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
      const preview = await uploadPreview(file, 'PROFESOR');
      setImportPreview(preview);
      setShowModal(true);
    } catch {
      alert('Error al procesar el archivo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    setIsImporting(true);
    try {
      const result = await confirmImport(importPreview.pending_rows, 'PROFESOR');
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
      {/* Header + Import */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#CC1C1C]">
          Profesores – Escuela de Estadística
        </h2>
        <div className="flex items-center gap-3">
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
      </div>

      <ImportPreviewModal
        isOpen={showModal}
        preview={importPreview}
        isLoading={isImporting}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />

      {/* Fila 1: KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Card principal */}
        <div className="bg-[#CC1C1C] rounded-2xl p-5 flex items-center gap-4 shadow-sm relative">
          <div className="text-white/30">
            <Users className="h-20 w-20" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="text-5xl font-bold text-white leading-tight">
              {isLoading ? '...' : totalProfesores}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-white mt-1">
              Profesores registrados
            </p>
            <p className="text-xs text-white/80 mt-0.5">Total en el sistema</p>
          </div>
          <p className="absolute bottom-3 right-5 text-xs text-white/60 uppercase tracking-wider">
            {selectedPeriod || 'TODOS'}
          </p>
        </div>

        {/* 4 mini cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MiniKpiCard
            icon={<UserCheck className="h-5 w-5" />}
            value={stats.total_planta}
            label="Planta"
            percentage={kpiPercentages.planta}
            color="#CC1C1C"
          />
          <MiniKpiCard
            icon={<Briefcase className="h-5 w-5" />}
            value={stats.total_contratistas}
            label="Contratistas"
            percentage={kpiPercentages.contratistas}
            color="#1565C0"
          />
          <MiniKpiCard
            icon={<GraduationCap className="h-5 w-5" />}
            value={stats.total_asistentes}
            label="Asistentes de docencia"
            percentage={kpiPercentages.asistentes}
            color="#4CAF50"
          />
          <MiniKpiCard
            icon={<BookOpen className="h-5 w-5" />}
            value={stats.total_comision}
            label="Comisión de estudios"
            percentage={kpiPercentages.comision}
            color="#FF9800"
          />
        </div>
      </div>

      {/* Fila 2: Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProfesorVariationChart data={variationChartData} />
        <ProfesorHoursChart data={hoursChartData} />
      </div>

      {/* Fila 3: Tabla de profesores */}
      <ProfesorTable
        data={profesoresActivos}
        isLoading={isLoadingActivos}
        onRefresh={fetchProfesoresActivos}
      />
    </>
  );
};
