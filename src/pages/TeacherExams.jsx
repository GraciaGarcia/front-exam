// src/pages/TeacherExams.jsx
import React, { useState, useEffect } from "react";
import ExamCard from "../components/ExamCard";
import ExamModal from "../components/ExamModal";

const TeacherExams = () => {
    const [exams, setExams] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const profesor = "Profesor Demo"; // En un caso real, se obtendrá del contexto de autenticación

    useEffect(() => {
        fetch(`http://localhost:5000/api/teacher/exams?profesor=${profesor}`)
            .then(res => res.json())
            .then(data => setExams(data));
    }, [profesor]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Exámenes de {profesor}</h1>
            <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Agregar Examen
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exams.map(exam => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}
            </div>
            {modalOpen && <ExamModal closeModal={() => setModalOpen(false)} profesor={profesor} refreshExams={() => {
                // Lógica para recargar exámenes tras agregar uno nuevo
                fetch(`http://localhost:5000/api/teacher/exams?profesor=${profesor}`)
                    .then(res => res.json())
                    .then(data => setExams(data));
            }} />}
        </div>
    );
};

export default TeacherExams;
