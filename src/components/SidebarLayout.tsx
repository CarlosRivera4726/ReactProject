
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);          // drawer (móvil)
  const { logout, getEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkBase =
    "flex items-center p-2 rounded-lg transition text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";
  const active =
    "!bg-gray-100 dark:!bg-gray-700 !text-gray-900 dark:!text-white";

  const userRole = localStorage.getItem('role'); // "inspector" | "admin"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Botón hamburguesa (móvil) */}
      <button
        type="button"
        aria-controls="sidebar-multi-level-sidebar"
        aria-label="Open sidebar"
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* SIDEBAR */}
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${open ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col justify-between">
          <ul className="space-y-2 font-medium">
            {userRole === 'INSPECTOR' && (
              <li>
                <NavLink
                  to="ver-inspecciones-curso"
                  end
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? active : ""}`
                  }
                >
                  <span className="ms-3">Ver Inspecciones en Curso</span>
                </NavLink>
              </li>
            )}

            {userRole === 'USUARIO' && (
              <li>
                <NavLink to="ver-inspecciones-finalizadas" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                  <span className="flex-1 ms-3 whitespace-nowrap">Ver Inspecciones Finalizadas</span>
                </NavLink>
              </li>
            )}

            {(userRole === 'ADMIN' || userRole === 'DEVELOPER') && (
              <>
                <li>
                  <NavLink to="crear-ubicacion" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                    <span className="flex-1 ms-3 whitespace-nowrap">Crear Ubicacion</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="ver-ubicaciones" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                    <span className="flex-1 ms-3 whitespace-nowrap">Ver Ubicaciones</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="ver-inspectores" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                    <span className="flex-1 ms-3 whitespace-nowrap">Ver Inspectores</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="ver-usuarios" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                    <span className="flex-1 ms-3 whitespace-nowrap">Ver Usuarios</span>
                  </NavLink>
                </li>
              </>
            )}


          </ul>

          {/* Usuario y logout */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {localStorage.getItem('role')}: {getEmail()}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay móvil */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 sm:hidden" onClick={() => setOpen(false)} />
      )}

      {/* CONTENIDO */}
      <div className="sm:ml-64">
        <main className="min-h-screen w-full p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
