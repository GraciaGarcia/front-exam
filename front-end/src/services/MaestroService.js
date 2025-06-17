import config from "../config";
const BASE_URL = `https://literate-funicular-694vwv9q6662665-5000.app.github.dev/maestro`;
/* const BASE_URL_API = `${config.baseURLAPI}/maestro`; */

export const obtenerMaestros = async () => {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Error al obtener maestros");
  return await res.json();
};

export const obtenerMaestroPorId = async (id_maestro) => {
  const res = await fetch(`${BASE_URL}/${id_maestro}`);
  if (!res.ok) throw new Error("Maestro no encontrado");
  return await res.json();
};

export const crearMaestro = async (maestro) => {
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(maestro),
  });
  if (!res.ok) throw new Error("Error al crear maestro");
  return await res.json();
};

export const actualizarMaestro = async (id_maestro, maestro) => {
  const res = await fetch(`${BASE_URL}/${id_maestro}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(maestro),
  });
  if (!res.ok) throw new Error("Error al actualizar maestro");
  return await res.json();
};

export const eliminarMaestroLogico = async (id_maestro) => {
  const res = await fetch(`${BASE_URL}/eliminar/${id_maestro}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al eliminar maestro");
  return await res.json();
};

export const restaurarMaestro = async (id_maestro) => {
  const res = await fetch(`${BASE_URL}/restaurar/${id_maestro}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al restaurar maestro");
  return await res.json();
};
