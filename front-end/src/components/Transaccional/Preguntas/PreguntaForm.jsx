import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { crearPregunta, actualizarPregunta } from "../../../services/PreguntaService";
import { obtenerMaestros } from "../../../services/MaestroService";
import { obtenerUnidades } from "../../../services/UnidadDidacticaService";
import { FiTrash2 } from "react-icons/fi";

function PreguntaForm({ initialData, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    id_maestro: "",
    unidadesSeleccionadas: [],
    descripcion: "",
    puntos: 1,
    tipo_pregunta: "unica",
    feedback_error: "",
    opciones: [],
  });

  const [maestros, setMaestros] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [nuevaOpcion, setNuevaOpcion] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const [maestrosData, unidadesData] = await Promise.all([
        obtenerMaestros(),
        obtenerUnidades(),
      ]);
      setMaestros(maestrosData.filter((m) => m.estado === "A"));
      setUnidades(unidadesData.filter((u) => u.estado === "A"));
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        unidadesSeleccionadas: [initialData.id_ud],
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (form.tipo_pregunta === "vf") {
      setForm((prev) => ({
        ...prev,
        opciones: [
          { texto_opcion: "Verdadero", valor_respuesta: "F" },
          { texto_opcion: "Falso", valor_respuesta: "F" },
        ],
      }));
    } else if (!initialData) {
      setForm((prev) => ({
        ...prev,
        opciones: [],
      }));
    }
  }, [form.tipo_pregunta, initialData]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnidadSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm((prev) => ({ ...prev, unidadesSeleccionadas: selected }));
  };

  const agregarOpcion = () => {
    if (!nuevaOpcion.trim() || form.tipo_pregunta === "vf") return;
    setForm((prev) => ({
      ...prev,
      opciones: [...prev.opciones, { texto_opcion: nuevaOpcion, valor_respuesta: "F" }],
    }));
    setNuevaOpcion("");
  };

  const actualizarOpcion = (index, texto) => {
    const nuevas = [...form.opciones];
    nuevas[index].texto_opcion = texto;
    setForm((prev) => ({ ...prev, opciones: nuevas }));
  };

  const eliminarOpcion = (index) => {
    if (form.tipo_pregunta === "vf") return;
    const nuevas = form.opciones.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, opciones: nuevas }));
  };

  const marcarCorrecta = (index) => {
    const nuevas = form.opciones.map((op, i) => {
      if (form.tipo_pregunta === "unica" || form.tipo_pregunta === "vf") {
        return { ...op, valor_respuesta: i === index ? "V" : "F" };
      } else {
        return i === index
          ? { ...op, valor_respuesta: op.valor_respuesta === "V" ? "F" : "V" }
          : op;
      }
    });
    setForm((prev) => ({ ...prev, opciones: nuevas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.puntos <= 0) return Swal.fire("Error", "Puntaje debe ser mayor que 0", "warning");
    if (form.opciones.length < 2) return Swal.fire("Error", "Mínimo 2 opciones", "warning");

    const correctas = form.opciones.filter((o) => o.valor_respuesta === "V").length;

    if (form.tipo_pregunta === "unica" && correctas !== 1)
      return Swal.fire("Error", "Debe haber solo una respuesta correcta", "error");
    if (form.tipo_pregunta === "multiple") {
      if (correctas < 2)
        return Swal.fire("Error", "Debe haber al menos dos respuestas correctas", "error");
      if (correctas === form.opciones.length)
        return Swal.fire("Error", "Debe haber al menos una incorrecta", "error");
    }

    if (form.tipo_pregunta === "vf" && form.opciones.length !== 2)
      return Swal.fire("Error", "Debe haber exactamente 2 opciones (VF)", "error");

    const peticiones = form.unidadesSeleccionadas.map((id_ud) => {
      const payload = { ...form, id_ud };
      return initialData
        ? actualizarPregunta(initialData.id_pregunta, payload)
        : crearPregunta(payload);
    });

    try {
      await Promise.all(peticiones);
      Swal.fire("Éxito", `Pregunta ${initialData ? "actualizada" : "registrada"} correctamente`, "success");
      onSuccess();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la pregunta", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border mb-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8">
        {initialData ? "Editar Pregunta" : "Registrar Pregunta"}
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Parte izquierda: datos */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Seleccione maestro</label>
            <select
              name="id_maestro"
              value={form.id_maestro}
              onChange={handleInput}
              required
              className="w-full border rounded-lg p-2 shadow-sm"
            >
              <option value="">Seleccione maestro</option>
              {maestros.map((m) => (
                <option key={m.id_maestro} value={m.id_maestro}>
                  {m.nombre} {m.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Unidades Didácticas</label>
            <select
              multiple
              value={form.unidadesSeleccionadas}
              onChange={handleUnidadSelect}
              className="w-full border rounded-lg p-2 h-32 shadow-sm"
            >
              {unidades.map((u) => (
                <option key={u.id_ud} value={u.id_ud}>
                  {u.nombre}
                </option>
              ))}
            </select>
            <small className="text-gray-500">Mantén presionado Ctrl o Shift para seleccionar múltiples.</small>
          </div>

          <div>
            <label className="block font-medium mb-1">Puntaje</label>
            <input
              type="number"
              name="puntos"
              min="1"
              value={form.puntos}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 shadow-sm"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tipo de pregunta</label>
            <select
              name="tipo_pregunta"
              value={form.tipo_pregunta}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 shadow-sm"
            >
              <option value="unica">Única</option>
              <option value="multiple">Múltiple</option>
              <option value="vf">Verdadero/Falso</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Feedback de error (opcional)</label>
            <input
              name="feedback_error"
              value={form.feedback_error}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 shadow-sm"
            />
          </div>
        </div>

        {/* Parte derecha: opciones */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Opciones</h3>

          {form.tipo_pregunta !== "vf" && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nuevaOpcion}
                onChange={(e) => setNuevaOpcion(e.target.value)}
                placeholder="Nueva opción..."
                className="flex-1 border rounded-lg p-2 shadow-sm"
              />
              <button
                type="button"
                onClick={agregarOpcion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Agregar
              </button>
            </div>
          )}

          <div className="space-y-2">
            {form.opciones.map((op, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type={form.tipo_pregunta === "multiple" ? "checkbox" : "radio"}
                  name="respuestaCorrecta"
                  checked={op.valor_respuesta === "V"}
                  onChange={() => marcarCorrecta(index)}
                />
                <input
                  type="text"
                  value={op.texto_opcion}
                  onChange={(e) => actualizarOpcion(index, e.target.value)}
                  className="flex-1 border rounded-lg p-2 shadow-sm"
                />
                {form.tipo_pregunta !== "vf" && (
                  <button
                    type="button"
                    onClick={() => eliminarOpcion(index)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          {initialData ? "Actualizar" : "Registrar"}
        </button>
      </div>
    </form>
  );
}

export default PreguntaForm;
