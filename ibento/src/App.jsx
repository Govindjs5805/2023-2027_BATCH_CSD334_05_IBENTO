import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminEventReport from "./pages/AdminEventReport";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import AdminScanner from "./pages/AdminScanner";
import StudentDashboard from "./pages/StudentDashboard";
import EditProfile from "./pages/EditProfile";
import AdminAttendanceAnalytics from "./pages/AdminAttendanceAnalytics";
import MyEvents from "./pages/MyEvents";
import TicketView from "./pages/TicketView";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCheckIn from "./pages/AdminCheckIn";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
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
              <TicketView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute allowedRole="student">
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* CLUB LEAD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="clubLead">
              <AdminDashboard />
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
          path="/admin/registrations"
          element={
            <ProtectedRoute allowedRole="clubLead">
              <AdminRegistrations />
            </ProtectedRoute>
          }
        />
        <Route 
  path="/superadmin" 
  element={
    <ProtectedRoute allowedRole="superAdmin">
      <SuperAdminDashboard />
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

        {/* 🔥 EVENT SPECIFIC SCANNER */}
        <Route
          path="/admin/scanner/:eventId"
          element={
            <ProtectedRoute allowedRole="clubLead">
              <AdminScanner />
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
    <Route path="/events/:eventId" element={<EventDetails/>} />
      </Routes>
    </>
  );
}

export default App;