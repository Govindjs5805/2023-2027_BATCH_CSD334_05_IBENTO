import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../components/Admin/AdminLayout";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [eventCount, setEventCount] = useState(0);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const eventsSnap = await getDocs(collection(db, "events"));
      const regsSnap = await getDocs(collection(db, "registrations"));

      setEventCount(eventsSnap.size);
      setRegistrationCount(regsSnap.size);
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of campus event management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Total Events</p>
          <h2 className="text-4xl font-bold text-primary mt-2">
            {eventCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Total Registrations</p>
          <h2 className="text-4xl font-bold text-primary mt-2">
            {registrationCount}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/create-event"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-primary">
              Create Event
            </h3>
            <p className="text-gray-500 mt-2">
              Add a new campus event
            </p>
          </Link>

          <Link
            to="/admin/registrations"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-primary">
              View Registrations
            </h3>
            <p className="text-gray-500 mt-2">
              Manage student attendance
            </p>
          </Link>

          <Link
            to="/admin/analytics"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-primary">
              Attendance Analytics
            </h3>
            <p className="text-gray-500 mt-2">
              Visual attendance insights
            </p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
