import { ChartBarIcon, HomeIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);          // drawer (móvil)

  const linkBase =
    "flex items-center p-2 rounded-lg transition text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";
  const active =
    "!bg-gray-100 dark:!bg-gray-700 !text-gray-900 dark:!text-white";

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
            <li>
              <NavLink
                to="/ver-inspecciones-curso"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? active : ""}`
                }
              >
                <span className="ms-3">Ver Inspecciones en Curso</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/ver-inspecciones-finalizadas" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                <span className="flex-1 ms-3 whitespace-nowrap">Ver Inspecciones Finalizadas</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/crear-inspeccion-curso" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                <span className="flex-1 ms-3 whitespace-nowrap">Crear Inspección en Curso</span>
              </NavLink>
            </li>

          </ul>
          <ul className="space-y-2 font-medium">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 justify-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue- w-full gap-2">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
              </svg>
              Cerrar Sesión
            </button>
          </ul>
        </div>
        <div>

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
