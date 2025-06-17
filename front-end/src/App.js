import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import UnidadesDidacticas from "./pages/UnidadesDidacticas";
import Maestros from "./pages/Maestros";
import Examenes from "./pages/Examenes";
import Preguntas from "./pages/Preguntas";
import Ajustes from "./pages/Ajustes";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/unidades" element={<UnidadesDidacticas />} />
            <Route path="/maestros" element={<Maestros />} />
            <Route path="/examenes" element={<Examenes />} />
            <Route path="/preguntas" element={<Preguntas />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
