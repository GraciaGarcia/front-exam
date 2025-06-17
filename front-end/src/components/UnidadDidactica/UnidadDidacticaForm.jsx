import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function UnidadDidacticaForm({ initialData, maestros, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    id_maestro: "",
    carrera: "",
    semestre: "",
    creditos: "",
  });

  const [errors, setErrors] = useState({});

  const carreras = [
    "Análisis de Sistemas",
    "Gestión Agrícola",
    "Sistemas Empresariales",
    "Producción Agraria",
  ];

  const semestres = [
    "1er Semestre",
    "2do Semestre",
    "3er Semestre",
    "4to Semestre",
    "5to Semestre",
    "6to Semestre",
  ];

  useEffect(() => {
    setFormData({
      nombre: initialData?.nombre || "",
      id_maestro: initialData?.id_maestro || "",
      carrera: initialData?.carrera || "",
      semestre: initialData?.semestre || "",
      creditos: initialData?.creditos ?? "",
    });
    setErrors({});
  }, [initialData]);

  const validar = () => {
    const err = {};

    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{4,}[\w\sÁÉÍÓÚáéíóúÑñ]*$/;

    if (!formData.nombre.trim()) {
      err.nombre = "El nombre es obligatorio";
    } else if (!nombreValido.test(formData.nombre.trim())) {
      err.nombre = "Debe iniciar con al menos 4 letras. No se permiten solo números.";
    }

    if (!formData.id_maestro) {
      err.id_maestro = "Seleccione un maestro";
    }

    if (!formData.carrera.trim()) {
      err.carrera = "Seleccione una carrera";
    }

    if (!formData.semestre.trim()) {
      err.semestre = "Seleccione un semestre";
    }

    if (formData.creditos === "") {
      err.creditos = "Los créditos son obligatorios";
    } else if (parseFloat(formData.creditos) <= 0) {
      err.creditos = "Debe ser mayor a 0";
    }

    return err;
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));

    // Eliminar el error si el campo se vuelve válido
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "nombre" && value.trim()) delete newErrors.nombre;
      if (name === "id_maestro" && value) delete newErrors.id_maestro;
      if (name === "carrera" && value.trim()) delete newErrors.carrera;
      if (name === "semestre" && value.trim()) delete newErrors.semestre;
      if (name === "creditos") {
        const val = parseFloat(value);
        if (!isNaN(val) && val > 0) delete newErrors.creditos;
      }

      return newErrors;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validar();
    if (Object.keys(errores).length > 0) return setErrors(errores);

    const datos = {
      ...formData,
      id_maestro: Number(formData.id_maestro),
      creditos: formData.creditos ? parseFloat(formData.creditos) : null,
    };

    await onSave(datos);

    await MySwal.fire(
      "¡Éxito!",
      initialData
        ? "La unidad fue actualizada correctamente."
        : "La unidad fue registrada correctamente.",
      "success"
    );

    onCancel();
  };




  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-8 animate-fade-in space-y-8 border-t-4 border-blue-600"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {initialData ? "Editar Unidad Didáctica" : "Registrar Nueva Unidad"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="font-semibold text-sm block mb-1">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Algoritmos"
              className={`w-full px-4 py-2 rounded border focus:outline-none shadow-sm focus:ring-2 ${errors.nombre ? "border-red-500 ring-red-300" : "border-gray-300"
                }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Maestro */}
          <div>
            <label htmlFor="id_maestro" className="font-semibold text-sm block mb-1">
              Maestro asignado *
            </label>
            <select
              id="id_maestro"
              name="id_maestro"
              value={formData.id_maestro}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded border shadow-sm focus:outline-none focus:ring-2 ${errors.id_maestro ? "border-red-500 ring-red-300" : "border-gray-300"
                }`}
            >
              <option value="">-- Seleccionar maestro --</option>
              {maestros
                .filter((m) => m.estado === "A")
                .map((m) => (
                  <option key={m.id_maestro} value={m.id_maestro}>
                    {m.nombre} {m.apellido}
                  </option>
                ))}
            </select>
            {errors.id_maestro && (
              <p className="text-red-500 text-sm mt-1">{errors.id_maestro}</p>
            )}
          </div>
        </div>

        {/* Carrera y semestre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carrera */}
          <div>
            <label htmlFor="carrera" className="font-semibold text-sm block mb-1">
              Carrera *
            </label>
            <select
              id="carrera"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded border shadow-sm focus:outline-none focus:ring-2 ${errors.carrera ? "border-red-500 ring-red-300" : "border-gray-300"
                }`}
            >
              <option value="">-- Seleccionar carrera --</option>
              {carreras.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.carrera && (
              <p className="text-red-500 text-sm mt-1">{errors.carrera}</p>
            )}
          </div>

          {/* Semestre */}
          <div>
            <label htmlFor="semestre" className="font-semibold text-sm block mb-1">
              Semestre *
            </label>
            <select
              id="semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded border shadow-sm focus:outline-none focus:ring-2 ${errors.semestre ? "border-red-500 ring-red-300" : "border-gray-300"
                }`}
            >
              <option value="">-- Seleccionar semestre --</option>
              {semestres.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.semestre && (
              <p className="text-red-500 text-sm mt-1">{errors.semestre}</p>
            )}
          </div>

        </div>

        {/* Créditos */}
        <div>
          <label htmlFor="creditos" className="font-semibold text-sm block mb-1">
            Créditos
          </label>
          <input
            id="creditos"
            name="creditos"
            type="number"
            step="0.1"
            min="0"
            value={formData.creditos}
            onChange={handleChange}
            placeholder="Ej. 3.5"
            className={`w-full px-4 py-2 rounded border shadow-sm focus:outline-none focus:ring-2 ${errors.creditos ? "border-red-500 ring-red-300" : "border-gray-300"
              }`}
          />
          {errors.creditos && (
            <p className="text-red-500 text-sm mt-1">{errors.creditos}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white border border-gray-300 px-5 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition"
          >
            {initialData ? "Guardar cambios" : "Registrar unidad"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UnidadDidacticaForm;
