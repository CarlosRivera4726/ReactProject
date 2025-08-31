import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CrearInspeccionEnCurso from "./pages/CrearInspeccionEnCurso";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/SidebarLayout";
import VerInspeccionesEnCurso from "./pages/VerInspeccionesEnCurso";
import VerInspeccionesFinalizadas from "./pages/VerInspeccionesFinalizadas";
import InicioSesion from "./pages/InicioSesion";

function App() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/home" index element={<Home />} />
          {/* inspecciones en curso las ve el inspector y usuario*/}
          <Route path="ver-inspecciones-curso" element={<VerInspeccionesEnCurso />} />
          {/* inspecciones finalizadas las ve solo el usuario*/}
          <Route path="ver-inspecciones-finalizadas" element={<VerInspeccionesFinalizadas />} />
          {/* crear inspeccion lo ve solo el inspector*/}
          <Route path="crear-inspeccion-curso" element={<CrearInspeccionEnCurso />} />
          {/* <Route path="billing" element={<Billing />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="users" element={<Users />} /> */}
          <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
