import { 
  FaHome, 
  FaChalkboardTeacher, 
  FaBook, 
  FaClipboardList,
  FaQuestionCircle,
  FaCog,
  FaChevronLeft, 
  FaChevronRight,
  FaGraduationCap
} from "react-icons/fa";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";

function MenuItem({ item, isOpen }) {
  const resolved = useResolvedPath(item.path);
  const match = useMatch({ path: resolved.pathname, end: true });
  const active = Boolean(match);

  return (
    <NavLink
      to={item.path}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
        active
          ? "bg-[#003964] text-white font-medium shadow-md"
          : "hover:bg-[#00396480] text-gray-200"
      } ${isOpen ? "justify-start" : "justify-center"}`}
    >
      <span className={active ? "text-white" : "text-[#FFAC02]"}>
        {item.icon}
      </span>
      {isOpen && <span>{item.label}</span>}
    </NavLink>
  );
}

function SettingsLink({ isOpen }) {
  const resolved = useResolvedPath("/ajustes");
  const match = useMatch({ path: resolved.pathname, end: true });
  const active = Boolean(match);

  return (
    <NavLink
      to="/ajustes"
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
        active
          ? "bg-[#003964] text-white font-medium shadow-md"
          : "hover:bg-[#00396480] text-gray-200"
      } ${isOpen ? "justify-start" : "justify-center"}`}
    >
      <FaCog className={`w-4 h-4 ${active ? "text-white" : "text-[#FFAC02]"}`} />
      {isOpen && <span>Ajustes</span>}
    </NavLink>
  );
}

function Sidebar({ isOpen, setIsOpen }) {
  const menuSections = [
    {
      title: "PERSONA",
      items: [
        { icon: <FaHome className="w-4 h-4" />, label: "Inicio", path: "/" },
      ]
    },
    {
      title: "GESTOR ACADÉMICO",
      items: [
        { icon: <FaChalkboardTeacher className="w-4 h-4" />, label: "Docentes", path: "/maestros" },
        { icon: <FaBook className="w-4 h-4" />, label: "Unidades Didácticas", path: "/unidades" },
      ]
    },
    {
      title: "BANCO DE PROBLEMAS",
      items: [
        { icon: <FaClipboardList className="w-4 h-4" />, label: "Exámenes", path: "/examenes" },
        { icon: <FaQuestionCircle className="w-4 h-4" />, label: "Preguntas", path: "/preguntas" },
      ]
    }
  ];

  return (
    <aside
      className={`flex flex-col h-screen bg-[#005186] text-white ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out fixed left-0 top-0 z-10`}
    >
      {/* Logo y Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-[#003964] h-16">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-2xl text-[#FFAC02]" />
            <span className="font-bold text-lg text-white">Sistema Académico</span>
          </div>
        ) : (
          <FaGraduationCap className="text-2xl text-[#FFAC02] mx-auto" />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-[#003964] transition-colors text-[#FFAC02]"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <FaChevronLeft className="w-4 h-4" />
          ) : (
            <FaChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuSections.map((section, index) => (
          <div key={index} className="mb-6">
            {isOpen && (
              <h3 className="text-xs uppercase font-semibold text-[#FFAC02] px-3 mb-2 tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <MenuItem item={item} isOpen={isOpen} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Configuración */}
      <div className="mb-6">
        {isOpen && (
          <h3 className="text-xs uppercase font-semibold text-[#FFAC02] px-3 mb-2 tracking-wider">
            CONFIGURACIÓN
          </h3>
        )}
        <ul className="space-y-1">
          <li>
            <SettingsLink isOpen={isOpen} />
          </li>
        </ul>
      </div>

      {/* Usuario */}
      <div className="p-4 border-t border-[#003964]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFAC02] flex items-center justify-center text-[#005186] font-bold">
            U
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-medium text-white">Usuario Admin</p>
              <p className="text-xs text-[#FFAC02]">Administrador</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
