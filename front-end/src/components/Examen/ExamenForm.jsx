import React, { useState, useEffect } from "react";

const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function ExamenForm({ onExamComplete }) {
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hora en segundos

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onExamComplete && onExamComplete(); // termina el examen por tiempo
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onExamComplete]);

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("No se permite cambiar de pestaña durante el examen.");
                onExamComplete && onExamComplete();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [onExamComplete]);

    const questions = [
        {
            id: 1,
            type: "text",
            question: "¿Cuál es tu nombre?",
        },
        {
            id: 2,
            type: "text",
            question:
                "Describe la importancia de la modularidad en el desarrollo de software.",
        },
        {
            id: 3,
            type: "multiple",
            question: "¿Cuál de estos es un lenguaje de programación?",
            options: ["Python", "HTML", "CSS", "SQL"],
        },
        {
            id: 4,
            type: "multiple",
            question: "Selecciona los frameworks de backend en JavaScript:",
            options: ["React", "Express", "Vue", "NestJS"],
        },
    ];

    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const isFormComplete = () => {
        for (const q of questions) {
            const answer = answers[q.id];
            if (q.type === "text") {
                if (!answer || answer.trim() === "") {
                    return false;
                }
            } else if (q.type === "multiple") {
                if (!answer || !Array.isArray(answer) || answer.length === 0) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormComplete()) {
            alert("Por favor, rellena todas las respuestas.");
            return;
        }
        console.log("Respuestas enviadas:", answers);
        onExamComplete && onExamComplete();
    };

    return (
        <div className="relative max-w-3xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
            <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded p-2 font-mono">
                {formatTime(timeLeft)}
            </div>
            <h1 className="text-3xl font-bold text-center mb-8">
                Formulario de Examen
            </h1>
            <form onSubmit={handleSubmit}>
                {questions.map((q) => (
                    <div key={q.id} className="mb-6">
                        <p className="text-xl font-medium mb-2">{q.question}</p>
                        {q.type === "text" ? (
                            <input
                                type="text"
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                placeholder="Escribe tu respuesta..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 select-none"
                            />
                        ) : (
                            <div className="flex flex-col space-y-2 select-none">
                                {q.options.map((option, index) => (
                                    <label
                                        key={index}
                                        className="inline-flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            value={option}
                                            onChange={(e) =>
                                                handleChange(
                                                    q.id,
                                                    answers[q.id]
                                                        ? [...answers[q.id], e.target.value]
                                                        : [e.target.value]
                                                )
                                            }
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Enviar respuestas
                </button>
            </form>
        </div>
    );
}
