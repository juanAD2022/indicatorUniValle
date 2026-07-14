import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Upload } from 'lucide-react';
import { IndicatorCard } from '@components/IndicatorCard';
import { DemandBarChart } from '@components/DemandBarChart';
import { ParticipationStackedChart } from '@components/ParticipationStackedChart';
import { VinculacionPieChart } from '@components/VinculacionPieChart';
import { CancelacionHorarioChart } from '@components/CancelacionHorarioChart';
import { ApoyoDonutChart } from '@components/ApoyoDonutChart';
import { PlaneacionTable } from '@components/PlaneacionTable';
import { ProgramacionTable } from '@components/ProgramacionTable';
import { ApoyoTable } from '@components/ApoyoTable';
import { ImportPreviewModal } from '@components/ImportPreviewModal';
import { uploadPreview, confirmImport } from '@services/studentIndicator/importService';
import type { ImportPreview } from '@services/studentIndicator/importService';
import {
  getPlaneacionCursos,
  getProgramacionCursos,
  getApoyoEconomico,
  getPlaneacionStats,
  getProgramacionStats,
  getApoyoStats,
} from '@services/gestionDirectiva';
import type {
  PlaneacionCurso,
  ProgramacionCurso,
  ApoyoEconomico,
  PlaneacionStats,
  ProgramacionStats,
  ApoyoStats,
  DemandChartData,
  ParticipationChartData,
  VinculacionChartData,
  CancelacionChartData,
  ApoyoChartData,
} from '@models/GestionDirectiva';
import { usePeriod } from '@context/usePeriod';
import {
  BookOpen,
  Users,
  GraduationCap,
  XCircle,
  CheckCircle,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export const GestionDirectiva = () => {
  const { selectedPeriod, setAvailablePeriods } = usePeriod();

  // Data states
  const [planeacionData, setPlaneacionData] = useState<PlaneacionCurso[]>([]);
  const [programacionData, setProgramacionData] = useState<ProgramacionCurso[]>([]);
  const [apoyoData, setApoyoData] = useState<ApoyoEconomico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats states
  const [planeacionStats, setPlaneacionStats] = useState<PlaneacionStats>({
    total_cursos: 0,
    total_cupos_solicitados: 0,
    total_grupos_estimados: 0,
    total_grupos_aprobados: 0,
    promedio_cupo_grupo: 0,
  });
  const [programacionStats, setProgramacionStats] = useState<ProgramacionStats>({
    total_grupos: 0,
    total_matriculados: 0,
    total_cancelaron: 0,
    total_aprobaron: 0,
    total_reprobaron: 0,
    tasa_aprobacion: 0,
    tasa_cancelacion: 0,
  });
  const [apoyoStats, setApoyoStats] = useState<ApoyoStats>({
    total_eventos: 0,
    total_participantes: 0,
    total_apoyo_economico: 0,
    promedio_apoyo_economico: 0,
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
      const [planeacion, programacion, apoyo] = await Promise.all([
        getPlaneacionCursos(selectedPeriod ?? undefined),
        getProgramacionCursos(selectedPeriod ?? undefined),
        getApoyoEconomico(selectedPeriod ?? undefined),
      ]);
      setPlaneacionData(planeacion);
      setProgramacionData(programacion);
      setApoyoData(apoyo);

      // Set available periods from all data combined
      const allPeriods = [
        ...new Set([
          ...planeacion.map((d) => d.periodo),
          ...programacion.map((d) => d.periodo),
          ...apoyo.map((d) => d.periodo),
        ]),
      ].sort().reverse();
      setAvailablePeriods(allPeriods);
    } catch {
      setError('Error al cargar los datos de gestión directiva.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, setAvailablePeriods]);

  const fetchStats = useCallback(async () => {
    try {
      const periodo = selectedPeriod ?? undefined;
      const [pStats, prStats, aStats] = await Promise.all([
        getPlaneacionStats(periodo),
        getProgramacionStats(periodo),
        getApoyoStats(periodo),
      ]);
      setPlaneacionStats(pStats);
      setProgramacionStats(prStats);
      setApoyoStats(aStats);
    } catch {
      // Silenciar error
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Computed chart data
  const demandChartData: DemandChartData[] = useMemo(() => {
    const cuposByCurso: Record<string, number> = {};
    planeacionData.forEach((d) => {
      cuposByCurso[d.curso] = (cuposByCurso[d.curso] || 0) + d.cupos_solicitados;
    });
    const matriculadosByCurso: Record<string, number> = {};
    programacionData.forEach((d) => {
      matriculadosByCurso[d.curso] = (matriculadosByCurso[d.curso] || 0) + d.matriculados;
    });
    const cursos = [...new Set([...Object.keys(cuposByCurso), ...Object.keys(matriculadosByCurso)])];
    return cursos.slice(0, 6).map((curso) => ({
      curso: curso.length > 15 ? curso.substring(0, 15) + '...' : curso,
      cupos_solicitados: cuposByCurso[curso] || 0,
      matriculados: matriculadosByCurso[curso] || 0,
    }));
  }, [planeacionData, programacionData]);

  const participationChartData: ParticipationChartData[] = useMemo(() => {
    const byCurso: Record<string, { asistentes: number; cancelados: number }> = {};
    programacionData.forEach((d) => {
      if (!byCurso[d.curso]) byCurso[d.curso] = { asistentes: 0, cancelados: 0 };
      byCurso[d.curso].asistentes += Math.max(0, d.matriculados - d.cancelaron);
      byCurso[d.curso].cancelados += d.cancelaron;
    });
    return Object.entries(byCurso)
      .slice(0, 5)
      .map(([name, vals]) => ({
        name: name.length > 12 ? name.substring(0, 12) + '...' : name,
        asistentes: vals.asistentes,
        cancelados: vals.cancelados,
      }));
  }, [programacionData]);

  const vinculacionChartData: VinculacionChartData[] = useMemo(() => {
    const counts: Record<string, number> = {};
    programacionData.forEach((d) => {
      const v = d.vinculacion || 'Sin especificar';
      counts[v] = (counts[v] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [programacionData]);

  const cancelacionChartData: CancelacionChartData[] = useMemo(() => {
    const byHorario: Record<string, number> = {};
    programacionData.forEach((d) => {
      const h = d.horario || 'Sin horario';
      byHorario[h] = (byHorario[h] || 0) + d.cancelaron;
    });
    return Object.entries(byHorario)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([horario, cancelados]) => ({
        horario: horario.length > 10 ? horario.substring(0, 10) + '...' : horario,
        cancelados,
      }));
  }, [programacionData]);

  const apoyoChartData: ApoyoChartData[] = useMemo(() => {
    const byTipo: Record<string, number> = {};
    apoyoData.forEach((d) => {
      const t = d.tipo_evento || 'Sin tipo';
      byTipo[t] = (byTipo[t] || 0) + Number(d.apoyo_economico);
    });
    return Object.entries(byTipo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tipo_evento, monto]) => ({ tipo_evento, monto }));
  }, [apoyoData]);

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
      const preview = await uploadPreview(file, 'GESTION_DIRECTIVA');
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
      const result = await confirmImport(importPreview.pending_rows, 'GESTION_DIRECTIVA');
      setShowModal(false);
      setImportPreview(null);
      setImportSuccess(result.message);
      fetchAllData();
      fetchStats();
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
          Gestión Directiva – Escuela de Estadística
        </h2>
      </div>

      {/* Import button + success message */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
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

      {/* KPIs row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        <IndicatorCard
          value={planeacionStats.total_cursos}
          label="CURSOS SOLICITADOS"
          subtitle="Total cursos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#1565C0"
          icon={<BookOpen className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={programacionStats.total_grupos}
          label="GRUPOS CREADOS"
          subtitle="Total grupos"
          description={selectedPeriod || 'TODOS'}
          bgColor="#4CAF50"
          icon={<Users className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={programacionStats.total_matriculados}
          label="ESTUDIANTES MATRICULADOS"
          subtitle="Total matriculados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#FF9800"
          icon={<GraduationCap className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={programacionStats.total_cancelaron}
          label="CANCELADOS"
          subtitle="Total cancelados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#CC1C1C"
          icon={<XCircle className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={programacionStats.total_aprobaron}
          label="APROBACIÓN"
          subtitle="Total aprobados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#4CAF50"
          icon={<CheckCircle className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={`${programacionStats.tasa_aprobacion.toFixed(1)}%`}
          label="TASA APROBACIÓN"
          subtitle="Aprobados / Evaluados"
          description={selectedPeriod || 'TODOS'}
          bgColor="#9C27B0"
          icon={<TrendingUp className="h-10 w-10" strokeWidth={1.5} />}
        />
        <IndicatorCard
          value={apoyoStats.total_participantes}
          label="PARTICIPANTES APOYADOS"
          subtitle="Total participantes"
          description={selectedPeriod || 'TODOS'}
          bgColor="#00ACC1"
          icon={<UserCheck className="h-10 w-10" strokeWidth={1.5} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <DemandBarChart data={demandChartData} />
        <ParticipationStackedChart data={participationChartData} />
        <VinculacionPieChart data={vinculacionChartData} />
        <CancelacionHorarioChart data={cancelacionChartData} />
        <ApoyoDonutChart data={apoyoChartData} />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#CC1C1C] mb-2 uppercase tracking-wide">
            Planeación de cursos
          </h3>
          <PlaneacionTable
            data={planeacionData}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#CC1C1C] mb-2 uppercase tracking-wide">
            Programación de cursos
          </h3>
          <ProgramacionTable
            data={programacionData}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#CC1C1C] mb-2 uppercase tracking-wide">
            Apoyo económico
          </h3>
          <ApoyoTable
            data={apoyoData}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
          />
        </div>
      </div>

      <div className="mt-8 mb-4 text-xs text-gray-500 text-center">
        Los indicadores se calculan con base en la información registrada en el sistema.
      </div>
    </>
  );
};
