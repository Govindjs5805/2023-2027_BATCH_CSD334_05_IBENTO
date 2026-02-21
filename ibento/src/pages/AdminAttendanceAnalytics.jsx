import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminAttendanceAnalytics() {
  const { clubId } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  // Load club events
  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(
        collection(db, "events"),
        where("clubId", "==", clubId)
      );

      const snap = await getDocs(q);
      setEvents(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    if (clubId) fetchEvents();
  }, [clubId]);

  // Load event-specific analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!selectedEvent) return;

      const regQuery = query(
        collection(db, "registrations"),
        where("eventId", "==", selectedEvent)
      );

      const regSnap = await getDocs(regQuery);

      let regCount = 0;
      let checkCount = 0;

      regSnap.forEach(doc => {
        regCount++;
        if (doc.data().checkInStatus) checkCount++;
      });

      setTotalRegistrations(regCount);
      setTotalCheckedIn(checkCount);
    };

    loadAnalytics();
  }, [selectedEvent]);

  const attendancePercentage =
    totalRegistrations > 0
      ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1)
      : 0;

  return (
    <AdminLayout>
      <h2>Attendance Analytics</h2>

      {!selectedEvent && (
        <>
          <p>Select Event:</p>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedEvent && (
        <div style={{ marginTop: "30px" }}>
          <StatCard title="Total Registrations" value={totalRegistrations} />
          <StatCard title="Checked-In" value={totalCheckedIn} />
          <StatCard title="Attendance %" value={`${attendancePercentage}%`} />

          <SimpleBar
            total={totalRegistrations}
            checked={totalCheckedIn}
          />
        </div>
      )}
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
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: "15px"
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: "22px", marginTop: "10px" }}>{value}</p>
    </div>
  );
}

// Simple visual bar (no chart library needed)
function SimpleBar({ total, checked }) {
  const percentage =
    total > 0 ? (checked / total) * 100 : 0;

  return (
    <div style={{ marginTop: "20px" }}>
      <p>Attendance Visual</p>
      <div
        style={{
          width: "100%",
          height: "25px",
          background: "#e5e7eb",
          borderRadius: "6px"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#10b981",
            borderRadius: "6px"
          }}
        ></div>
      </div>
    </div>
  );
}

export default AdminAttendanceAnalytics;