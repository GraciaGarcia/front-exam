// src/pages/StudentExams.jsx
import React, { useState, useEffect } from "react";

const StudentExamModal = ({ examId, onClose }) => {
    const [exam, setExam] = useState(null);
    const [respuestas, setRespuestas] = useState({});

    useEffect(() => {
        if (examId) {
            fetch(`http://localhost:5000/api/student/exams/${examId}`)
                .then((res) => res.json())
                .then((data) => {
                    setExam(data);
                })
                .catch((err) => console.error("Error al obtener el examen:", err));
        }
    }, [examId]);

    const handleChange = (preguntaId, opcionId) => {
        setRespuestas({ ...respuestas, [preguntaId]: opcionId });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/api/student/exams/${examId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(respuestas),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                onClose();
            })
            .catch((err) => alert("Error al enviar las respuestas"));
    };

    if (!exam) return <div className="p-6 text-center">Cargando examen...</div>;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 max-h-full overflow-auto w-11/12 md:w-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{exam.titulo}</h1>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Cerrar
                    </button>
                </div>
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Enviar Examen
                    </button>
                </form>
            </div>
        </div>
    );
};

const StudentExams = () => {
    const [exams, setExams] = useState([]);
    const [showExamModal, setShowExamModal] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/student/exams")
            .then((res) => res.json())
            .then((data) => setExams(data))
            .catch((err) => console.error("Error al obtener exámenes:", err));
    }, []);

    const openExamModal = (examId) => {
        setSelectedExamId(examId);
        setShowExamModal(true);
    };

    const closeExamModal = () => {
        setShowExamModal(false);
        setSelectedExamId(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Exámenes Disponibles Hoy</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        className="border rounded shadow p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => openExamModal(exam.id)}
                    >
                        <h2 className="text-xl font-semibold">{exam.titulo}</h2>
                        <p>{exam.descripcion}</p>
                    </div>
                ))}
            </div>
            {showExamModal && (
                <StudentExamModal examId={selectedExamId} onClose={closeExamModal} />
            )}
        </div>
    );
};

export default StudentExams;
