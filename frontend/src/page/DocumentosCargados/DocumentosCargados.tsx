import { ProceedingsTable } from '@components/ProceedingsTable';
import { FileUp } from 'lucide-react';

export const DocumentosCargados = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#CC1C1C] flex items-center gap-2">
          <FileUp className="h-7 w-7" />
          Documentos Cargados
        </h2>
        <p className="text-gray-600 mt-1">
          Visualiza y gestiona los documentos cargados por sección académica.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
            Pregrado
          </h3>
          <ProceedingsTable categoryId={1} />
        </section>

        <section>
          <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
            Posgrado
          </h3>
          <ProceedingsTable categoryId={2} />
        </section>
      </div>
    </>
  );
};
