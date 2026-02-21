import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminDashboard() {
  const { clubId, fullName } = useAuth();

  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      if (!clubId) return;

      // Get Events
      const eventQuery = query(
        collection(db, "events"),
        where("clubId", "==", clubId)
      );
      const eventSnap = await getDocs(eventQuery);

      setTotalEvents(eventSnap.size);

      // Collect event IDs
      const eventIds = eventSnap.docs.map(doc => doc.id);

      if (eventIds.length === 0) return;

      // Get Registrations for those events
      const regSnap = await getDocs(collection(db, "registrations"));

      let regCount = 0;
      let checkInCount = 0;

      regSnap.forEach(doc => {
        const data = doc.data();

        if (eventIds.includes(data.eventId)) {
          regCount++;
          if (data.checkInStatus) checkInCount++;
        }
      });

      setTotalRegistrations(regCount);
      setTotalCheckedIn(checkInCount);
    };

    loadStats();
  }, [clubId]);

  const attendancePercentage =
    totalRegistrations > 0
      ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1)
      : 0;

  return (
    <AdminLayout>
      <h2>Welcome, {fullName}</h2>
      <p>Club Overview Dashboard</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        <StatCard title="Total Events" value={totalEvents} />
        <StatCard title="Total Registrations" value={totalRegistrations} />
        <StatCard title="Total Checked-In" value={totalCheckedIn} />
        <StatCard title="Attendance %" value={`${attendancePercentage}%`} />
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: "24px", marginTop: "10px" }}>{value}</p>
    </div>
  );
}

export default AdminDashboard;