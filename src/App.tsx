import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CrearInspeccionEnCurso from "./pages/CrearInspeccionEnCurso";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/SidebarLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import VerInspeccionesEnCurso from "./pages/VerInspeccionesEnCurso";
import VerInspeccionesFinalizadas from "./pages/VerInspeccionesFinalizadas";
import CrearUbicacion from "./pages/CrearUbicacion";

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
        <Route path="crear-ubicacion" element={<CrearUbicacion />} />
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
