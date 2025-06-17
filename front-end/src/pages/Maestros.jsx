import { useState } from "react";
import MaestroList from "../components/Maestro/MaestroList";
import MaestroForm from "../components/Maestro/MaestroForm";

export default function Maestros() {
  const [maestroEditar, setMaestroEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false); // Para recargar lista

  const handleEdit = (maestro) => {
    setMaestroEditar(maestro);
    setMostrarFormulario(true);
  };

  const handleNuevo = () => {
    setMaestroEditar(null);
    setMostrarFormulario(true);
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setMaestroEditar(null);
  };

  const handleSuccess = () => {
    setMostrarFormulario(false);
    setMaestroEditar(null);
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl mb-6 font-bold text-center">Gestión de Maestros</h1>

      {!mostrarFormulario && (
        <div className="mb-4 text-right">
          <button
            onClick={handleNuevo}
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Nuevo Maestro
          </button>
        </div>
      )}

      {mostrarFormulario ? (
        <MaestroForm
          maestroEditar={maestroEditar}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      ) : (
        <MaestroList key={refreshFlag} onEdit={handleEdit} />
      )}
    </div>
  );
}
