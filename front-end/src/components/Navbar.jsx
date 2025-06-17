import { FaBell, FaSearch, FaBars } from "react-icons/fa"; 

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-16 fixed top-0 left-64 right-0 z-10 shadow-sm">
      <div className="flex items-center justify-between h-full">
        <button 
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <FaBars className="text-gray-600" />
        </button>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <FaBell className="text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            
          </div>
        </div>
      </div>
    </header>
  );
}