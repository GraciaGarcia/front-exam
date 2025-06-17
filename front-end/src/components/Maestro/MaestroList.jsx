import { useEffect, useState } from "react";
import {
  obtenerMaestros,
  eliminarMaestroLogico,
  restaurarMaestro,
} from "../../services/MaestroService";

export default function MaestroList({ onEdit }) {
  const [maestros, setMaestros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaestros = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerMaestros();
      setMaestros(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaestros();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este maestro?")) return;
    try {
      await eliminarMaestroLogico(id);
      fetchMaestros();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRestaurar = async (id) => {
    try {
      await restaurarMaestro(id);
      fetchMaestros();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p className="p-4">Cargando maestros...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Apellido</th>
            <th className="border border-gray-300 px-4 py-2">Correo</th>
            <th className="border border-gray-300 px-4 py-2">Celular</th>
            <th className="border border-gray-300 px-4 py-2">Carrera</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maestros.map((m) => (
            <tr
              key={m.id_maestro}
              className={m.estado === "I" ? "bg-red-100" : ""}
            >
              <td className="border border-gray-300 px-4 py-2">{m.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{m.apellido}</td>
              <td className="border border-gray-300 px-4 py-2">{m.correo}</td>
              <td className="border border-gray-300 px-4 py-2">{m.celular || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{m.carrera || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {m.estado === "A" ? "Activo" : "Inactivo"}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(m)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                {m.estado === "A" ? (
                  <button
                    onClick={() => handleEliminar(m.id_maestro)}
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestaurar(m.id_maestro)}
                    className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
                  >
                    Restaurar
                  </button>
                )}
              </td>
            </tr>
          ))}
          {maestros.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No hay maestros registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
