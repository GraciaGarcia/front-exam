import { useState } from "react";
import Swal from "sweetalert2";
import { restaurarUnidad } from "../../services/UnidadDidacticaService";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";

function UnidadDidacticaList({ unidades, maestros, onEdit, onDelete, onReload }) {
  const [verActivos, setVerActivos] = useState(true);

  const unidadesFiltradas = unidades.filter((u) =>
    verActivos ? u.estado === "A" : u.estado !== "A"
  );

  const nombreMaestro = (id_maestro) => {
    const maestro = maestros.find((m) => Number(m.id_maestro) === Number(id_maestro));
    return maestro ? `${maestro.nombre} ${maestro.apellido}` : "Desconocido";
  };

  const handleDelete = (id_ud) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La unidad será desactivada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onDelete(id_ud);
          Swal.fire("Eliminado", "Unidad desactivada exitosamente", "success");
        } catch {
          Swal.fire("Error", "No se pudo eliminar la unidad", "error");
        }
      }
    });
  };

  const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(fecha).replace(" de ", " de ").replace(",", " del");
};


  const handleRestore = (id_ud) => {
    Swal.fire({
      title: "¿Deseas restaurar esta unidad?",
      text: "La unidad volverá a estar activa.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restaurarUnidad(id_ud);
          await onReload(); // recargar desde el padre
          Swal.fire("Restaurado", "Unidad restaurada correctamente", "success");
        } catch {
          Swal.fire("Error", "No se pudo restaurar la unidad", "error");
        }
      }
    });
  };

  return (
    <section className="p-6 md:p-10 bg-white/70 rounded-2xl shadow-xl backdrop-blur-sm">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-800">
          {verActivos ? "Unid. Activas" : "Unid. Inactivas"}
        </h2>

        <button
          onClick={() => setVerActivos(!verActivos)}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition shadow-md 
            ${verActivos
              ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          {verActivos ? "Ver Inactivas" : "Ver Activas"}
        </button>
      </header>

      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-300 bg-white text-sm">
          <thead className="bg-blue-50 text-gray-600 uppercase text-xs font-bold tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Maestro</th>
              <th className="px-6 py-3 text-left">Carrera</th>
              <th className="px-6 py-3 text-center">Semestre</th>
              <th className="px-6 py-3 text-center">Créditos</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3 text-center">Fecha</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {unidadesFiltradas.length > 0 ? (
              unidadesFiltradas.map((u) => (
                <tr key={u.id_ud} className="hover:bg-slate-50 transition-all duration-200">
                  <td className="px-6 py-4 font-medium text-gray-800">{u.nombre}</td>
                  <td className="px-6 py-4">{nombreMaestro(u.id_maestro)}</td>
                  <td className="px-6 py-4">{u.carrera}</td>
                  <td className="px-6 py-4 text-center">{u.semestre || "-"}</td>
                  <td className="px-6 py-4 text-center">{u.creditos ?? "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block text-xs font-bold px-3 py-1 rounded-full shadow-sm 
                        ${u.estado === "A"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"}`}
                    >
                      {u.estado === "A" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{formatearFecha(u.fecha_creacion)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3 items-center">
                      {verActivos ? (
                        <>
                          <button
                            onClick={() => onEdit && onEdit(u)}
                            title="Editar"
                            className="text-yellow-500 hover:text-yellow-600 transition"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id_ud)}
                            title="Eliminar"
                            className="text-red-500 hover:text-red-600 transition"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRestore(u.id_ud)}
                          title="Restaurar"
                          className="text-green-600 hover:text-green-700 transition"
                        >
                          <FiRefreshCw className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-400 text-sm italic">
                  No hay unidades {verActivos ? "activas" : "inactivas"} registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UnidadDidacticaList;
