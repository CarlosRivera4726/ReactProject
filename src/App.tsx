import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CrearInspeccionEnCurso from "./pages/inspecciones/CrearInspeccionEnCurso";
import NotFound from "./pages/NotFound/NotFound";
import SidebarLayout from "./components/SidebarLayout";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import VerInspeccionesEnCurso from "./pages/inspecciones/VerInspeccionesEnCurso";
import VerInspeccionesFinalizadas from "./pages/inspecciones/VerInspeccionesFinalizadas";
import CrearUbicacion from "./pages/ubicaciones/CrearUbicacion";
import VerUbicaciones from "./pages/ubicaciones/VerUbicaciones";

function App() {
  return (
    <Routes>
      {/* Ruta pública para login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <SidebarLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        {/** ubicaciones */}
        <Route path="ver-ubicaciones" element={<VerUbicaciones />} />
        <Route path="crear-ubicacion" element={<CrearUbicacion />} />

        {/** inspecciones */}
        {/* inspecciones en curso las ve el inspector y usuario*/}
        <Route path="ver-inspecciones-curso" element={<VerInspeccionesEnCurso />} />
        {/* inspecciones finalizadas las ve solo el usuario*/}
        <Route path="ver-inspecciones-finalizadas" element={<VerInspeccionesFinalizadas />} />
        {/* crear inspeccion lo ve solo el inspector*/}
        <Route path="crear-inspeccion-curso" element={<CrearInspeccionEnCurso />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
