import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import LocationIcon from "../assets/location.svg";
import AddIcon from "../assets/AddIcon.svg";
import EyeIcon from "../assets/EyeIcon.svg";
import InspectionIcon from "../assets/InspectionIcon.svg";
import SpanLink from "./SpanLink";
import UsersIcon from "../assets/UsersIcon.svg";
import EditIcon from "../assets/pencil.svg";

export default function SidebarLayout() {
  const [ddUbic, setDdUbic] = useState(false);
  const [ddInsp, setDdInsp] = useState(false);
  const [ddUser, setDdUser] = useState(false);
  const [open, setOpen] = useState(false);
  const { logout, getEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const linkBase = "flex items-center p-2 rounded-lg transition text-white/90 hover:bg-white/10";
  const active = "!bg-white/15 !text-white";
  const sectionBtn = "cursor-pointer flex items-center w-full p-1 text-base text-white/90 transition duration-75 rounded-lg hover:bg-white/10";

  const userRole = localStorage.getItem("role");
  console.log(userRole)
  return (
    // ====== TODO BLANCO ======
    <div className="min-h-screen bg-white">
      {/* Hamburguesa móvil */}
      <button
        type="button"
        aria-controls="sidebar-multi-level-sidebar"
        aria-label="Open sidebar"
        onClick={() => setOpen(s => !s)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-slate-700 rounded-lg sm:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
      >
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      {/* SIDEBAR azul oscuro */}
      <aside
        id="sidebar-multi-level-sidebar"
        aria-label="Sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#0E1C58] flex flex-col justify-between">
          <ul className="space-y-2 font-medium">
            {userRole === "INSPECTOR" && (
              <li>
                <NavLink to="ver-inspecciones-curso" end onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                  <span className="ms-3">Ver Inspecciones en Curso</span>
                </NavLink>
                <NavLink to="crear-inspeccion-curso" end onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                  <span className="ms-3">Crear Inspecciones en Curso</span>
                </NavLink>
              </li>
            )}

            {userRole === "USUARIO" && (
              <li>
                <NavLink to="ver-inspecciones-finalizadas" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                  <span className="flex-1 ms-3 whitespace-nowrap">Ver Inspecciones Finalizadas</span>
                </NavLink>
              </li>
            )}

            {(userRole === "ADMIN" || userRole === "DEVELOPER") && (
              <>
                {/* Ubicaciones */}
                <li>
                  <button type="button" onClick={() => setDdUbic(v => !v)} aria-expanded={ddUbic}
                    className={sectionBtn} aria-controls="dropdown-ubicaciones" data-collapse-toggle="dropdown-ubicaciones">
                    <img src={LocationIcon} alt="location-icon" width={23} height={25} />
                    <span className="flex-1 ms-3 text-left whitespace-nowrap">Gestión Ubicaciones</span>
                    <svg className="w-3 h-3 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul id="dropdown-ubicaciones" className={`${ddUbic ? "block" : "hidden"} py-2 space-y-2`}>
                    <li>
                      <NavLink to="crear-ubicacion" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink><img src={AddIcon} alt="" width={23} height={25} />Crear Ubicacion</SpanLink>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="ver-ubicaciones" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink><img src={EyeIcon} alt="" width={23} height={25} />Ver Ubicaciones</SpanLink>
                      </NavLink>
                    </li>
                  </ul>
                </li>

                {/* Inspectores */}
                <li>
                  <button type="button" onClick={() => setDdInsp(v => !v)} aria-expanded={ddInsp}
                    className={sectionBtn} aria-controls="dropdown-inspection" data-collapse-toggle="dropdown-inspection">
                    <img src={InspectionIcon} alt="inspection-icon" width={23} height={25} />
                    <span className="flex-1 ms-3 text-left whitespace-nowrap">Gestion Inspectiores</span>
                    <svg className="w-3 h-3 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul id="dropdown-inspection" className={`${ddInsp ? "block" : "hidden"} py-2 space-y-2`}>
                    <li>
                      <NavLink to="ver-inspectores" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink><img src={EyeIcon} alt="" width={23} height={25} />Ver Inspectores</SpanLink>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="crear-inspector" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink>
                          <img src={EditIcon} alt="add-icon" width={23} height={25} />
                          Crear Inspector
                        </SpanLink>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="ver-ubicaciones" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink><img src={AddIcon} alt="" width={23} height={25} />Añadir ubicacion a Inspector</SpanLink>
                      </NavLink>
                    </li>
                  </ul>
                </li>

                {/* Usuarios */}
                <li>
                  <button type="button" className={sectionBtn} onClick={() => setDdUser(v => !v)}
                    aria-expanded={ddUser} aria-controls="dropdown-user" data-collapse-toggle="dropdown-user">
                    <img src={UsersIcon} alt="users-icon" width={23} height={25} />
                    <span className="flex-1 ms-3 text-left whitespace-nowrap">Gestion Usuarios</span>
                    <svg className="w-3 h-3 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul id="dropdown-user" className={`${ddUser ? "block" : "hidden"} py-2 space-y-2`}>
                    <li>
                      <NavLink to="ver-usuarios" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink><img src={EyeIcon} alt="" width={23} height={25} />Ver Usuarios</SpanLink>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="crear-usuario" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        <SpanLink><img src={AddIcon} alt="" width={23} height={25} />Crear Usuario</SpanLink>
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          {/* Usuario y logout */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="text-sm text-white/90 mb-2">
                {localStorage.getItem("role")}: {getEmail()}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 text-white/90 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay móvil */}
      {open && <div className="fixed inset-0 z-30 bg-black/30 sm:hidden" onClick={() => setOpen(false)} />}

      {/* CONTENIDO — también blanco */}
      <div className="sm:ml-72">
        <main className="min-h-screen w-full p-6 bg-white">
          {/* si NO quieres “tarjeta”, deja solo el Outlet */}
          <Outlet />

          {/* Si sí quieres “tarjeta” blanca con sombra suave, descomenta:
          <div className="bg-white rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-6 md:p-8">
            <Outlet />
          </div>
          */}
        </main>
      </div>
    </div>
  );
}
