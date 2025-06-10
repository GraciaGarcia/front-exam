// src/pages/StudentExam.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StudentExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [respuestas, setRespuestas] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5000/api/student/exams/${examId}`)
            .then((res) => res.json())
            .then((data) => {
                setExam(data);
            })
            .catch((err) => console.error("Error al obtener el examen:", err));
    }, [examId]);

    const handleChange = (preguntaId, opcionId) => {
        setRespuestas({ ...respuestas, [preguntaId]: opcionId });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Las respuestas serán un objeto { pregunta_id: opcion_id, ... }
        fetch(`http://localhost:5000/api/student/exams/${examId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(respuestas),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                navigate("/student/exams");
            })
            .catch((err) => alert("Error al enviar las respuestas"));
    };

    if (!exam) return <div>Cargando examen...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{exam.titulo}</h1>
            <p className="mb-4">{exam.descripcion}</p>
            <form onSubmit={handleSubmit}>
                {exam.preguntas && exam.preguntas.map((pregunta) => (
                    <div key={pregunta.id} className="mb-4">
                        <p className="font-semibold mb-1">{pregunta.texto}</p>
                        {pregunta.opciones.map((opcion) => (
                            <div key={opcion.id} className="flex items-center mb-1">
                                <input
                                    type="radio"
                                    name={`pregunta-${pregunta.id}`}
                                    value={opcion.id}
                                    checked={respuestas[pregunta.id] === opcion.id}
                                    onChange={() => handleChange(pregunta.id, opcion.id)}
                                    className="mr-2"
                                />
                                <label>{opcion.texto}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Enviar Examen
                </button>
            </form>
        </div>
    );
};

export default StudentExam;
