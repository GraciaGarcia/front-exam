import { useEffect, useState } from "react";
import UnidadDidacticaListPro from "../components/UnidadDidactica/UnidadDidacticaList";
import UnidadDidacticaForm from "../components/UnidadDidactica/UnidadDidacticaForm";
import {
  obtenerUnidades,
  crearUnidad,
  eliminarUnidadLogica,
  actualizarUnidad,
} from "../services/UnidadDidacticaService";
import { obtenerMaestros } from "../services/MaestroService";
import { FaPlusCircle, FaListUl } from "react-icons/fa";

export default function UnidadesDidacticas() {
  const [unidades, setUnidades] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [unidadEditada, setUnidadEditada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Carga los datos de la API
const cargarDatos = async () => {
  setLoading(true);
  try {
    const [unidadesData, maestrosData] = await Promise.all([
      obtenerUnidades(),
      obtenerMaestros(),
    ]);
    setUnidades(unidadesData);
    setMaestros(maestrosData);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    cargarDatos();
  }, []);

  // Guarda nueva unidad o actualiza una existente
  const handleGuardar = async (unidad) => {
    try {
      if (modoEdicion && unidadEditada) {
        await actualizarUnidad(unidadEditada.id_ud, unidad);
      } else {
        await crearUnidad(unidad);
      }
      setModoEdicion(false);
      setUnidadEditada(null);
      setMostrarForm(false);
      await cargarDatos();
    } catch (error) {
      console.error("Error al guardar unidad didáctica", error);
    }
  };

  // Filtra por búsqueda
  const filtrarUnidades = () => {
    return unidades.filter((unidad) =>
      unidad.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      unidad.carrera.toLowerCase().includes(busqueda.toLowerCase()) ||
      unidad.semestre?.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  return (
    <main className="px-6 md:px-10 py-8 bg-gradient-to-r from-white to-gray-100 min-h-screen animate-fade-in">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">📚 Unidades Didácticas</h1>
          <p className="text-gray-500 mt-1">
            Administra las unidades activas e inactivas del sistema académico.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setUnidadEditada(null);
              setModoEdicion(false);
              setMostrarForm(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaPlusCircle /> Registrar Nueva Unidad
          </button>
          <button
            onClick={cargarDatos}
            className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
          >
            <FaListUl /> Recargar
          </button>
        </div>
      </header>

      {/* Barra de búsqueda */}
      <section className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, carrera o semestre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </section>

      {/* Formulario de edición */}
      {mostrarForm ? (
        <UnidadDidacticaForm
          initialData={modoEdicion ? unidadEditada : null}
          maestros={maestros}
          onSave={handleGuardar}
          onCancel={() => setMostrarForm(false)}
        />
      ) : loading ? (
        <div className="text-center py-12 text-gray-500 text-lg animate-pulse">Cargando unidades...</div>
      ) : (
        <UnidadDidacticaListPro
          unidades={filtrarUnidades()}
          maestros={maestros}
          onEdit={(unidad) => {
            setUnidadEditada(unidad);
            setModoEdicion(true);
            setMostrarForm(true);
          }}
          onDelete={async (id_ud) => {
            try {
              await eliminarUnidadLogica(id_ud);
              await cargarDatos();
            } catch (error) {
              console.error(error);
            }
          }}
          onReload={cargarDatos}
        />
      )}

      {/* Footer animado */}
      <footer className="mt-12 text-center text-sm text-gray-400 animate-fade-in">
        Sistema Académico © {new Date().getFullYear()} • Valle Grande
      </footer>
    </main>
  );
}
