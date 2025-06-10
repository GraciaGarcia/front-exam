import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TeacherExams from "./pages/TeacherExams";
import ExamPreview from "./pages/ExamPreview";
import StudentExams from "./pages/StudentExams";
import StudentExam from "./pages/StudentExam";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Rutas para el profesor */}
          <Route path="/teacher/exams" element={<TeacherExams />} />
          <Route path="/teacher/exams/:examId" element={<ExamPreview />} />

          {/* Rutas para el alumno */}
          <Route path="/student/exams" element={<StudentExams />} />
          <Route path="/student/exams/:examId" element={<StudentExam />} />

          {/* Ruta por defecto: se puede redirigir a la vista que se considere principal */}
          <Route path="*" element={<TeacherExams />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
