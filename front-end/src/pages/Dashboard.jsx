import { FaBook, FaChalkboardTeacher, FaClipboardList, FaUsers } from "react-icons/fa";

const stats = [
  { title: "Unidades Activas", value: "24", icon: <FaBook className="text-3xl" />, color: "bg-blue-100 text-blue-600" },
  { title: "Profesores", value: "15", icon: <FaChalkboardTeacher className="text-3xl" />, color: "bg-green-100 text-green-600" },
  { title: "Exámenes", value: "8", icon: <FaClipboardList className="text-3xl" />, color: "bg-purple-100 text-purple-600" },
  { title: "Estudiantes", value: "320", icon: <FaUsers className="text-3xl" />, color: "bg-orange-100 text-orange-600" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`p-6 rounded-xl shadow-md ${stat.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-30">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-4">
                <FaBook className="text-lg" />
              </div>
              <div>
                <p className="font-medium">Nueva unidad didáctica agregada</p>
                <p className="text-sm text-gray-500">Hace {item} hora{item !== 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full">
          <h3 className="text-lg font-semibold mb-4">Gestión de Unidades</h3>
          <p className="text-sm opacity-90 mb-6">Administra las unidades didácticas del sistema</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium self-start hover:bg-opacity-90 transition">
            Ir a Unidades
          </button>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full">
          <h3 className="text-lg font-semibold mb-4">Banco de Preguntas</h3>
          <p className="text-sm opacity-90 mb-6">Crea y gestiona preguntas para exámenes</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium self-start hover:bg-opacity-90 transition">
            Ver Preguntas
          </button>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full">
          <h3 className="text-lg font-semibold mb-4">Reportes</h3>
          <p className="text-sm opacity-90 mb-6">Genera reportes académicos</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium self-start hover:bg-opacity-90 transition">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
}