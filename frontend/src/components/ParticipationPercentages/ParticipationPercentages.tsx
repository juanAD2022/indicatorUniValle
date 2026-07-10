import type { ParticipationPercentagesProps } from './ParticipationPercentages.types';

export const ParticipationPercentages = ({
  pregrado,
  especializacion,
  maestria,
  className = '',
}: ParticipationPercentagesProps) => {
  const total = pregrado + especializacion + maestria;

  const pctPregrado = total > 0 ? (pregrado / total) * 100 : 0;
  const pctEspecializacion = total > 0 ? (especializacion / total) * 100 : 0;
  const pctMaestria = total > 0 ? (maestria / total) * 100 : 0;

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Participación por nivel (estudiantes)</h3>
        <div className="flex items-center justify-center h-40 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-6">Participación por nivel (estudiantes)</h3>
      <div className="flex items-center justify-around">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#CC1C1C]">{pctPregrado.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 mt-2">Pregrado</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-[#1565C0]">{pctEspecializacion.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 mt-2">Especialización</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-[#4CAF50]">{pctMaestria.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 mt-2">Maestría</div>
        </div>
      </div>
    </div>
  );
};
