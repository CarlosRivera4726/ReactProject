import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/SidebarLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="reports" element={<Reports />} />
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
