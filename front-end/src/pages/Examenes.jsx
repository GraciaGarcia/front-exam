import React, { useState } from "react";
import ExamenForm from "../components/Examen/ExamenForm";

export default function Examenes() {
    const exams = [
        {
            id: 1,
            name: "Curso de Fundamentos de JavaScript",
            area: "Programación",
            dateTime: "2025-07-01T09:00:00",
        },
        {
            id: 2,
            name: "Curso de Python Intermedio",
            area: "Programación",
            dateTime: "2025-07-02T10:00:00",
        },
        {
            id: 3,
            name: "Curso de Programación Avanzada en Java",
            area: "Programación",
            dateTime: "2025-07-03T11:00:00",
        },
        {
            id: 4,
            name: "Curso de Desarrollo Web con React",
            area: "Programación",
            dateTime: "2025-07-04T12:00:00",
        },
        {
            id: 5,
            name: "Curso de Backend con Node.js",
            area: "Programación",
            dateTime: "2025-07-05T13:00:00",
        },
        {
            id: 6,
            name: "Curso de Bases de Datos con SQL",
            area: "Programación",
            dateTime: "2025-07-06T14:00:00",
        },
        {
            id: 7,
            name: "Curso de Desarrollo Móvil con Flutter",
            area: "Programación",
            dateTime: "2025-07-07T15:00:00",
        },
        {
            id: 8,
            name: "Curso de Diseño y Arquitectura de Software",
            area: "Programación",
            dateTime: "2025-07-08T16:00:00",
        },
        {
            id: 9,
            name: "Curso de Ciberseguridad en Aplicaciones",
            area: "Programación",
            dateTime: "2025-07-09T17:00:00",
        },
        {
            id: 10,
            name: "Curso de Inteligencia Artificial y Machine Learning",
            area: "Programación",
            dateTime: "2025-07-10T18:00:00",
        },
        {
            id: 11,
            name: "Curso de Control de Versiones con Git",
            area: "Programación",
            dateTime: "2025-07-11T19:00:00",
        },
        {
            id: 12,
            name: "Curso de Testing y Calidad de Software",
            area: "Programación",
            dateTime: "2025-07-12T20:00:00",
        },
    ];

    const formatDateTime = (dateTimeStr) => {
        const dateObj = new Date(dateTimeStr);
        return `${dateObj.toLocaleDateString()} - ${dateObj.toLocaleTimeString()}`;
    };

    const [showModal, setShowModal] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);
    const [completedExams, setCompletedExams] = useState([]);

    const handleCardClick = (exam) => {
        if (completedExams.includes(exam.id)) return;
        setCurrentExam(exam);
        setShowModal(true);
    };

    const handleExamComplete = () => {
        if (currentExam) {
            setCompletedExams((prev) => [...prev, currentExam.id]);
        }
        setShowModal(false);
        setCurrentExam(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Listado de Exámenes
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        className="relative cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                        onClick={() => handleCardClick(exam)}
                    >
                        <img
                            src="/vg.png"
                            alt={exam.name}
                            className="mx-auto h-38 object-cover opacity-50"
                        />
                        <div className="p-4">
                            <h2
                                className={`text-2xl font-semibold mb-2 ${
                                    completedExams.includes(exam.id)
                                        ? "text-gray-200"
                                        : "text-gray-800"
                                }`}
                            >
                                {exam.name}
                            </h2>
                            <p
                                className={`mb-1 ${
                                    completedExams.includes(exam.id)
                                        ? "text-gray-200"
                                        : "text-gray-600"
                                }`}
                            >
                                <span className="font-medium">Área:</span> {exam.area}
                            </p>
                            <p
                                className={`${
                                    completedExams.includes(exam.id)
                                        ? "text-gray-200"
                                        : "text-gray-600"
                                }`}
                            >
                                <span className="font-medium">Fecha:</span>{" "}
                                {formatDateTime(exam.dateTime)}
                            </p>
                        </div>
                        {completedExams.includes(exam.id) && (
                            <div className="absolute inset-0 bg-gray-800 bg-opacity-55 flex items-center justify-center">
                                <span className="text-red-600 text-2xl font-bold">Revisando</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="bg-white rounded-lg p-6 max-w-2xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExamenForm onExamComplete={handleExamComplete} />
                    </div>
                </div>
            )}
        </div>
    );
}
