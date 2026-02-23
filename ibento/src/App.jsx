import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail"; // ✅ ADD THIS

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminEventReport from "./pages/AdminEventReport";
import AdminAttendanceAnalytics from "./pages/AdminAttendanceAnalytics";
import AdminCheckIn from "./pages/AdminCheckIn";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import Ticket from "./pages/Ticket";
import AdminCreateEvent from "./pages/AdminCreateEvent";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "70px" }}>
        <Routes>

          {/* Splash */}
          <Route path="/" element={<Splash />} />

          {/* Public */}
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ NEW VERIFY EMAIL ROUTE */}
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Student */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-events"
            element={
              <ProtectedRoute allowedRole="student">
                <MyEvents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ticket/:registrationId"
            element={
              <ProtectedRoute allowedRole="student">
                <Ticket />
              </ProtectedRoute>
            }
          />

          {/* Events Details */}
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Club Lead Main Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="clubLead">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Club Lead Sub Pages */}
          <Route
            path="/admin/registrations"
            element={
              <ProtectedRoute allowedRole="clubLead">
                <AdminRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/report"
            element={
              <ProtectedRoute allowedRole="clubLead">
                <AdminEventReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRole="clubLead">
                <AdminAttendanceAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-event"
            element={
              <ProtectedRoute allowedRole="clubLead">
                <AdminCreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/checkin"
            element={
              <ProtectedRoute allowedRole="clubLead">
                <AdminCheckIn />
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRole="superAdmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </>
  );
}

export default App;