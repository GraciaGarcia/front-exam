// src/pages/ExamPreview.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExamPreview = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/api/teacher/exams/${examId}`)
            .then((res) => res.json())
            .then((data) => {
                setExam(data);
                setTitulo(data.titulo);
                setDescripcion(data.descripcion);
            })
            .catch((err) => console.error("Error al obtener el examen", err));
    }, [examId]);

    const handleEdit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/api/teacher/exams/${examId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ titulo, descripcion }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                // Actualizar el estado en caso de ser necesario
            })
            .catch((err) => alert("Error al actualizar el examen"));
    };

    const handleDelete = () => {
        if (window.confirm("¿Deseas eliminar el examen?")) {
            fetch(`http://localhost:5000/api/teacher/exams/${examId}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    alert(data.message);
                    navigate("/teacher/exams");
                })
                .catch((err) => alert("Error al eliminar el examen"));
        }
    };

    if (!exam) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Vista Previa: {exam.titulo}</h1>
            <div className="mb-6">
                <p className="mb-2">{exam.descripcion}</p>
                <h3 className="text-lg font-semibold">Preguntas:</h3>
                <ol className="list-decimal pl-5">
                    {exam.preguntas && exam.preguntas.map((pregunta) => (
                        <li key={pregunta.id}>{pregunta.texto}</li>
                    ))}
                </ol>
            </div>
            <form onSubmit={handleEdit} className="mb-6">
                <div className="mb-4">
                    <label className="block mb-1">Editar Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Editar Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                >
                    Guardar Cambios
                </button>
            </form>
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Eliminar Examen
            </button>
        </div>
    );
};

export default ExamPreview;
