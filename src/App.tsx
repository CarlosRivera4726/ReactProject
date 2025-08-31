import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/SidebarLayout";

function App() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route path="/" index element={<Home />} />
        <Route path="/home" index element={<Home />} />
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
