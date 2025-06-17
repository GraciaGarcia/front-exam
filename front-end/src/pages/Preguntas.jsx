import { useCallback, useEffect, useState } from "react";
import {
  obtenerPreguntasCompletas,
  obtenerPreguntasInactivasConOpciones,
  eliminarPregunta,
  restaurarPregunta,
} from "../services/PreguntaService";
import { obtenerMaestros } from "../services/MaestroService";
import { obtenerUnidades } from "../services/UnidadDidacticaService";
import { FaPlusCircle, FaListUl } from "react-icons/fa";
import Swal from "sweetalert2";
import { FiChevronDown, FiChevronUp, FiTrash2, FiRefreshCw, FiEdit2 } from "react-icons/fi";
import PreguntaForm from "../components/Transaccional/Preguntas/PreguntaForm";

export default function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarOpciones, setMostrarOpciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verActivas, setVerActivas] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [preguntaEditada, setPreguntaEditada] = useState(null);

  const cargarPreguntas = useCallback(async () => {
    setLoading(true);
    try {
      const [preguntasData, maestrosData, unidadesData] = await Promise.all([
        verActivas ? obtenerPreguntasCompletas() : obtenerPreguntasInactivasConOpciones(),
        obtenerMaestros(),
        obtenerUnidades(),
      ]);
      setPreguntas(preguntasData);
      setMaestros(maestrosData);
      setUnidades(unidadesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, [verActivas]);

  useEffect(() => {
    cargarPreguntas();
  }, [cargarPreguntas]);

  const getNombreMaestro = (id_maestro) => {
    const maestro = maestros.find((m) => m.id_maestro === id_maestro);
    return maestro ? `${maestro.nombre} ${maestro.apellido}` : "No encontrado";
  };

  const getNombreUnidad = (id_ud) => {
    const ud = unidades.find((u) => u.id_ud === id_ud);
    return ud ? ud.nombre : "No encontrado";
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta pregunta?",
      text: "Se desactivará lógicamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await eliminarPregunta(id);
      await cargarPreguntas();
      Swal.fire("Eliminada", "La pregunta fue desactivada", "success");
    }
  };

  const handleRestaurar = async (id) => {
    const result = await Swal.fire({
      title: "¿Restaurar esta pregunta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await restaurarPregunta(id);
      await cargarPreguntas();
      Swal.fire("Restaurada", "La pregunta fue restaurada", "success");
    }
  };

  const filtrarPreguntas = () =>
    preguntas.filter((p) =>
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

  const handleEditar = (pregunta) => {
    setModoEdicion(true);
    setPreguntaEditada(pregunta);
    setMostrarForm(true);
  };

  const handleCancelForm = () => {
    setModoEdicion(false);
    setPreguntaEditada(null);
    setMostrarForm(false);
  };

  return (
    <main className="px-6 md:px-10 py-8 bg-gradient-to-r from-white to-gray-100 min-h-screen animate-fade-in">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">📚 Banco de Preguntas</h1>
          <p className="text-gray-500 mt-1">
            Administra las preguntas {verActivas ? "activas" : "inactivas"} del sistema académico.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
            onClick={() => {
              setPreguntaEditada(null);
              setModoEdicion(false);
              setMostrarForm(true);
            }}
          >
            <FaPlusCircle /> Nueva Pregunta
          </button>
          <button
            onClick={cargarPreguntas}
            className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
          >
            <FaListUl /> Recargar
          </button>
          <button
            onClick={() => setVerActivas(!verActivas)}
            className={`px-4 py-2 rounded-lg font-medium shadow-md transition ${
              verActivas ? "bg-yellow-400 hover:bg-yellow-500" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {verActivas ? "Ver Inactivas" : "Ver Activas"}
          </button>
        </div>
      </header>

      <section className="mb-6">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </section>

      {mostrarForm ? (
        <PreguntaForm
          initialData={modoEdicion ? preguntaEditada : null}
          onCancel={handleCancelForm}
          onSuccess={() => {
            handleCancelForm();
            cargarPreguntas();
          }}
        />
      ) : loading ? (
        <div className="text-center py-12 text-gray-500 text-lg animate-pulse">Cargando preguntas...</div>
      ) : (
        <div className="space-y-4">
          {filtrarPreguntas().map((p) => (
            <div key={p.id_pregunta} className="bg-white border rounded-xl shadow-md p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{p.descripcion}</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    <strong>ID:</strong> {p.id_pregunta} |
                    <strong> Maestro:</strong> {getNombreMaestro(p.id_maestro)} |
                    <strong> UD:</strong> {getNombreUnidad(p.id_ud)} |
                    <strong> Puntos:</strong> {p.puntos} |
                    <strong> Tipo:</strong> {p.tipo_pregunta} |
                    <strong> Estado:</strong>{" "}
                    <span className={p.estado === "A" ? "text-green-600" : "text-red-500"}>{p.estado}</span> |
                    <strong> Fecha:</strong> {new Date(p.fecha_creacion).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMostrarOpciones(p.id_pregunta === mostrarOpciones ? null : p.id_pregunta)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {mostrarOpciones === p.id_pregunta ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {verActivas ? (
                    <>
                      <button onClick={() => handleEditar(p)} className="text-yellow-500 hover:text-yellow-600">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleEliminar(p.id_pregunta)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestaurar(p.id_pregunta)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiRefreshCw />
                    </button>
                  )}
                </div>
              </div>

              {mostrarOpciones === p.id_pregunta && (
                <ul className="mt-4 space-y-2 pl-4">
                  {p.opciones?.map((op) => (
                    <li
                      key={op.id_detalle}
                      className={`p-3 rounded-lg border ${
                        op.valor_respuesta === "V"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <p>
                        <strong>ID:</strong> {op.id_detalle} |
                        <strong> Valor:</strong> {op.valor_respuesta === "V" ? "Correcta" : "Incorrecta"}
                      </p>
                      <p>{op.texto_opcion}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <footer className="mt-12 text-center text-sm text-gray-400 animate-fade-in">
        Sistema Académico © {new Date().getFullYear()} • Valle Grande
      </footer>
    </main>
  );
}
