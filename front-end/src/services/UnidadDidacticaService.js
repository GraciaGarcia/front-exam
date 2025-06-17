import config from "../config";
const BASE_URL = `https://literate-funicular-694vwv9q6662665-5000.app.github.dev/unidad_didactica`;
/* const BASE_URL = `${config.baseURL}/unidad_didactica`; */

export const obtenerUnidades = async () => {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Error al obtener unidades didácticas");
  return await res.json();
};

export const obtenerUnidadPorId = async (id_ud) => {
  const res = await fetch(`${BASE_URL}/${id_ud}`);
  if (!res.ok) throw new Error("Unidad didáctica no encontrada");
  return await res.json();
};

export const obtenerUnidadesPorEstado = async (estado) => {
  const res = await fetch(`${BASE_URL}/estado/${estado}`);
  if (!res.ok) throw new Error("Error al obtener unidades por estado");
  return await res.json();
};

export const obtenerUnidadesPorCarrera = async (carrera) => {
  const res = await fetch(`${BASE_URL}/carrera/${carrera}`);
  if (!res.ok) throw new Error("Error al obtener unidades por carrera");
  return await res.json();
};

export const crearUnidad = async (unidad) => {
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unidad),
  });
  if (!res.ok) throw new Error("Error al crear unidad");
  return await res.json();
};

export const actualizarUnidad = async (id_ud, unidad) => {
  const res = await fetch(`${BASE_URL}/${id_ud}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unidad),
  });
  if (!res.ok) throw new Error("Error al actualizar unidad");
  return await res.json();
};

export const eliminarUnidadLogica = async (id_ud) => {
  const res = await fetch(`${BASE_URL}/eliminar/${id_ud}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al eliminar unidad");
  return await res.json();
};

export const restaurarUnidad = async (id_ud) => {
  const res = await fetch(`${BASE_URL}/restaurar/${id_ud}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al restaurar unidad");
  return await res.json();
};
