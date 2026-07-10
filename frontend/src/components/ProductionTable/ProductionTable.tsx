import type { ProductionTableProps } from './ProductionTable.types';

export const ProductionTable = ({ data, className = '' }: ProductionTableProps) => {
  const totalRevNac = data.reduce((sum, r) => sum + r.revistas_nacionales, 0);
  const totalRevInt = data.reduce((sum, r) => sum + r.revistas_internacionales, 0);
  const totalPubEventos = data.reduce((sum, r) => sum + r.publicaciones_eventos, 0);
  const totalLibros = data.reduce((sum, r) => sum + r.libros, 0);
  const totalProyectosId = data.reduce((sum, r) => sum + r.proyectos_id, 0);
  const totalInformes = data.reduce((sum, r) => sum + r.informes_investigacion, 0);
  const total = totalRevNac + totalRevInt + totalPubEventos + totalLibros + totalProyectosId + totalInformes;

  const rows = [
    { tipo: 'Revistas Indexadas Nacionales', cantidad: totalRevNac },
    { tipo: 'Revistas Indexadas Internacionales', cantidad: totalRevInt },
    { tipo: 'Publicaciones en eventos académicos', cantidad: totalPubEventos },
    { tipo: 'Libros resultados de investigación', cantidad: totalLibros },
    { tipo: 'Proyectos de investigación y desarrollo', cantidad: totalProyectosId },
    { tipo: 'Informes de investigación', cantidad: totalInformes },
  ];

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Producción científica acumulada</h3>
        <div className="flex items-center justify-center h-40 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Producción científica acumulada</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo de producción</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.tipo}
                className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
              >
                <td className="px-4 py-3 text-gray-700">{row.tipo}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{row.cantidad}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-3 text-gray-900">TOTAL</td>
              <td className="px-4 py-3 text-right text-gray-900">{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
