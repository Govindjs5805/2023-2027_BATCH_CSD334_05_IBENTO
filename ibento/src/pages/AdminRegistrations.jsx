import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminRegistrations() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchEvents();
  }, []);

  // Fetch registrations by event
  const fetchRegistrations = async (eventId) => {
    setLoading(true);
    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", eventId)
    );
    const snap = await getDocs(q);
    setRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  // Mark attendance
  const markPresent = async (id) => {
    await updateDoc(doc(db, "registrations", id), {
      checkInStatus: true,
      checkInTime: new Date()
    });
    fetchRegistrations(selectedEventId);
  };
  const exportAttendance = () => {
  if (registrations.length === 0) {
    alert("No registrations to export");
    return;
  }

  // CSV Header
  let csvContent = "Student Name,Email,Check-in Status,Check-in Time\n";

  registrations.forEach((reg) => {
    const name = reg.userName || "-";
    const email = reg.userEmail;
    const status = reg.checkInStatus ? "Present" : "Absent";
    const time = reg.checkInTime
      ? new Date(reg.checkInTime.seconds * 1000).toLocaleString()
      : "—";

    csvContent += `${name},${email},${status},${time}\n`;
  });

  // Create downloadable file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "attendance_sheet.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <AdminLayout>
      <h1>Event Registrations</h1>

      <select
        style={{ padding: "10px", marginTop: "20px" }}
        value={selectedEventId}
        onChange={(e) => {
          setSelectedEventId(e.target.value);
          fetchRegistrations(e.target.value);
        }}
      >
        <option value="">Select Event</option>
        {events.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      {loading && <p>Loading...</p>}
        

      {!loading && registrations.length > 0 && (
        <>
  <button
    onClick={exportAttendance}
    style={{
      marginTop: "20px",
      padding: "10px 15px",
      backgroundColor: "#3ddc84",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    Export Attendance
  </button>

        <table style={{ marginTop: "30px", width: "100%" }} border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id}>
                <td>{reg.userName}</td>
                <td>{reg.userEmail}</td>
                <td>{reg.status}</td>
                <td>{reg.checkInStatus ? "Present" : "Absent"}</td>
                <td>
                  {!reg.checkInStatus && (
                    <button onClick={() => markPresent(reg.id)}>
                      Mark Present
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}

      {!loading && selectedEventId && registrations.length === 0 && (
        <p>No registrations found.</p>
      )}
    </AdminLayout>
  );
}

export default AdminRegistrations;
