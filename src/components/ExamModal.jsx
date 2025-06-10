// src/components/ExamModal.jsx
import React, { useState } from "react";

const ExamModal = ({ closeModal, profesor, refreshExams }) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [preguntas, setPreguntas] = useState([
        { texto: "", opciones: [{ texto: "", es_correcta: false }] }
    ]);

    const handleAgregarPregunta = () => {
        setPreguntas([...preguntas, { texto: "", opciones: [{ texto: "", es_correcta: false }] }]);
    };

    const handlePreguntaChange = (index, value) => {
        const nuevasPreguntas = [...preguntas];
        nuevasPreguntas[index].texto = value;
        setPreguntas(nuevasPreguntas);
    };

    const handleAgregarOpcion = (pregIndex) => {
        const nuevasPreguntas = [...preguntas];
        nuevasPreguntas[pregIndex].opciones.push({ texto: "", es_correcta: false });
        setPreguntas(nuevasPreguntas);
    };

    const handleOpcionChange = (pregIndex, opIndex, field, value) => {
        const nuevasPreguntas = [...preguntas];
        if (field === "texto") {
            nuevasPreguntas[pregIndex].opciones[opIndex].texto = value;
        } else if (field === "es_correcta") {
            // Cuando se marca una respuesta correcta, se puede optar por que solo una sea correcta
            nuevasPreguntas[pregIndex].opciones = nuevasPreguntas[pregIndex].opciones.map((op, i) => ({
                ...op,
                es_correcta: i === opIndex ? true : false
            }));
        }
        setPreguntas(nuevasPreguntas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/teacher/exams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, descripcion, profesor, preguntas })
        })
            .then(res => res.json())
            .then(() => {
                refreshExams();
                closeModal();
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg p-6 w-11/12 md:w-1/2">
                <h2 className="text-xl font-bold mb-4">Nuevo Examen</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={e => setTitulo(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        ></textarea>
                    </div>

                    {preguntas.map((pregunta, pregIndex) => (
                        <div key={pregIndex} className="border p-4 mb-4">
                            <label className="block font-semibold mb-1">{`Pregunta ${pregIndex + 1}`}</label>
                            <input
                                type="text"
                                value={pregunta.texto}
                                onChange={e => handlePreguntaChange(pregIndex, e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                                placeholder="Escribe la pregunta..."
                                required
                            />
                            <div>
                                {pregunta.opciones.map((opcion, opIndex) => (
                                    <div key={opIndex} className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            name={`pregunta-${pregIndex}`}
                                            checked={opcion.es_correcta}
                                            onChange={() => handleOpcionChange(pregIndex, opIndex, "es_correcta", true)}
                                            className="mr-2"
                                        />
                                        <input
                                            type="text"
                                            value={opcion.texto}
                                            onChange={e => handleOpcionChange(pregIndex, opIndex, "texto", e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            placeholder={`Opción ${opIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAgregarOpcion(pregIndex)}
                                    className="text-blue-500 underline"
                                >
                                    Agregar opción
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAgregarPregunta}
                        className="text-blue-500 underline mb-4"
                    >
                        Agregar otra pregunta
                    </button>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="mr-4 px-4 py-2 border rounded"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            Guardar Examen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamModal;
