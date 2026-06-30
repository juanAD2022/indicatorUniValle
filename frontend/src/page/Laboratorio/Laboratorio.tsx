import { NavBar } from '@components/NavBar';

export const Laboratorio = () => {
  return (
    <div className="min-h-screen bg-[#E8E8F0]">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#CC1C1C] mb-4">
            Laboratorio
          </h2>
          <p className="text-gray-600">
            Contenido de laboratorio.
          </p>
        </div>
      </main>
    </div>
  );
};
