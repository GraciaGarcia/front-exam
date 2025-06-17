import config from "../config";
const BASE_URL = `https://literate-funicular-694vwv9q6662665-5000.app.github.dev/pregunta`;
/* const BASE_URL = `${config.baseURL}/pregunta`; */

// ============================
// LISTAR
// ============================

export const obtenerPreguntas = async () => {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Error al obtener preguntas");
  return await res.json();
};

export const obtenerPreguntasCompletas = async () => {
  const res = await fetch(`${BASE_URL}/completa`);
  if (!res.ok) throw new Error("Error al obtener preguntas completas");
  return await res.json();
};

export const obtenerPreguntaPorId = async (id) => {
  const res = await fetch(`${BASE_URL}/completa/${id}`);
  if (!res.ok) throw new Error("Pregunta no encontrada");
  return await res.json();
};

export const obtenerPreguntasInactivas = async () => {
  const res = await fetch(`${BASE_URL}/inactivas`);
  if (!res.ok) throw new Error("Error al obtener preguntas inactivas");
  return await res.json();
};

export const obtenerPreguntasInactivasConOpciones = async () => {
  const res = await fetch(`${BASE_URL}/inactivas/completa`);
  if (!res.ok) throw new Error("Error al obtener preguntas inactivas con opciones");
  return await res.json();
};

// ============================
// CREAR / ACTUALIZAR
// ============================

export const crearPregunta = async (pregunta) => {
  const res = await fetch(`${BASE_URL}/completa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pregunta),
  });
  if (!res.ok) throw new Error("Error al crear pregunta");
  return await res.json();
};

export const actualizarPregunta = async (id, pregunta) => {
  const res = await fetch(`${BASE_URL}/completa/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pregunta),
  });
  if (!res.ok) throw new Error("Error al actualizar la pregunta");
  return await res.json();
};

// ============================
// ELIMINAR / RESTAURAR
// ============================

export const eliminarPregunta = async (id) => {
  const res = await fetch(`${BASE_URL}/eliminar/${id}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al eliminar la pregunta");
  return await res.json();
};

export const restaurarPregunta = async (id) => {
  const res = await fetch(`${BASE_URL}/restaurar/${id}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al restaurar la pregunta");
  return await res.json();
};
