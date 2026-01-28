import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminEventReport from "./pages/AdminEventReport";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={ <ProtectedRoute allowedRole="admin"><AdminDashboard />
        </ProtectedRoute>} />
        <Route path="/admin/registrations" element={ <ProtectedRoute allowedRole="admin"><AdminRegistrations /></ProtectedRoute>} />
        <Route path="/admin/report" element={ <ProtectedRoute allowedRole="admin"><AdminEventReport /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;