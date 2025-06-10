// src/components/ExamCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ExamCard = ({ exam }) => {
    const navigate = useNavigate();
    return (
        <div
            className="border rounded shadow p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/teacher/exams/${exam.id}`)}
        >
            <h2 className="text-xl font-semibold">{exam.titulo}</h2>
            <p>{exam.descripcion}</p>
        </div>
    );
};

export default ExamCard;
