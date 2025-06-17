import { useEffect, useState } from "react";
import { obtenerPreguntasConOpciones, eliminarPregunta, restaurarPregunta } from "../../../services/PreguntaService";
import Swal from "sweetalert2";
import { FiTrash2, FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";

function PreguntaList() {
  const [preguntas, setPreguntas] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const cargarPreguntas = async () => {
    try {
      const data = await obtenerPreguntasConOpciones();
      setPreguntas(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las preguntas", "error");
    }
  };

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Deseas eliminar esta pregunta?",
      text: "Se desactivará lógicamente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await eliminarPregunta(id);
      await cargarPreguntas();
      Swal.fire("Eliminada", "Pregunta desactivada correctamente", "success");
    }
  };

  const handleRestaurar = async (id) => {
    const result = await Swal.fire({
      title: "¿Deseas restaurar esta pregunta?",
      text: "Volverá a estar activa",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await restaurarPregunta(id);
      await cargarPreguntas();
      Swal.fire("Restaurada", "Pregunta restaurada correctamente", "success");
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Listado de Preguntas</h2>

      <div className="space-y-4">
        {preguntas.map((p) => (
          <div key={p.id_pregunta} className="border rounded-xl shadow-md p-5 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{p.descripcion}</h3>
                <p className="text-sm text-gray-500">Puntos: {p.puntos} | Tipo: {p.tipo_pregunta}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleExpand(p.id_pregunta)} className="text-blue-600 hover:text-blue-800">
                  {expanded === p.id_pregunta ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {p.estado === "A" ? (
                  <button onClick={() => handleEliminar(p.id_pregunta)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
                  </button>
                ) : (
                  <button onClick={() => handleRestaurar(p.id_pregunta)} className="text-green-600 hover:text-green-800">
                    <FiRefreshCw />
                  </button>
                )}
              </div>
            </div>

            {expanded === p.id_pregunta && (
              <ul className="mt-4 pl-4 space-y-2">
                {p.opciones?.map((op) => (
                  <li
                    key={op.id_detalle}
                    className={`p-3 rounded-lg border ${
                      op.valor_respuesta === "V"
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {op.texto_opcion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PreguntaList;
