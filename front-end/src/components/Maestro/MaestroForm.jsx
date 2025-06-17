import React, { useState, useEffect } from "react";
import {
  crearMaestro,
  actualizarMaestro,
} from "../../services/MaestroService";

export default function MaestroForm({ maestroEditar, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    carrera: "",
    estado: "A",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (maestroEditar) {
      setForm({
        nombre: maestroEditar.nombre || "",
        apellido: maestroEditar.apellido || "",
        correo: maestroEditar.correo || "",
        celular: maestroEditar.celular || "",
        carrera: maestroEditar.carrera || "",
        estado: maestroEditar.estado || "A",
      });
    }
  }, [maestroEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarEmail = (email) =>
    /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) return setError("El nombre es obligatorio");
    if (!form.apellido.trim()) return setError("El apellido es obligatorio");
    if (!form.correo.trim() || !validarEmail(form.correo))
      return setError("Correo inválido");
    if (form.celular && form.celular.length !== 9)
      return setError("Celular debe tener 9 dígitos");

    try {
      if (maestroEditar) {
        await actualizarMaestro(maestroEditar.id_maestro, form);
      } else {
        await crearMaestro(form);
      }
      onSuccess();
      setForm({
        nombre: "",
        apellido: "",
        correo: "",
        celular: "",
        carrera: "",
        estado: "A",
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md p-4 bg-white rounded shadow mx-auto"
    >
      <h2 className="text-2xl mb-4">
        {maestroEditar ? "Editar Maestro" : "Nuevo Maestro"}
      </h2>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <label className="block mb-2">
        Nombre *
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 mt-1"
          required
        />
      </label>

      <label className="block mb-2">
        Apellido *
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 mt-1"
          required
        />
      </label>

      <label className="block mb-2">
        Correo *
        <input
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 mt-1"
          required
        />
      </label>

      <label className="block mb-2">
        Celular
        <input
          type="text"
          name="celular"
          value={form.celular}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 mt-1"
          maxLength={9}
          placeholder="Ej: 987654321"
        />
      </label>

      <label className="block mb-2">
        Carrera
        <input
          type="text"
          name="carrera"
          value={form.carrera}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 mt-1"
        />
      </label>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="estado"
            value="A"
            checked={form.estado === "A"}
            onChange={handleChange}
          />{" "}
          Activo
        </label>
        <label>
          <input
            type="radio"
            name="estado"
            value="I"
            checked={form.estado === "I"}
            onChange={handleChange}
          />{" "}
          Inactivo
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
