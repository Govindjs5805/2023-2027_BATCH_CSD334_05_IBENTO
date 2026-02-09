import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminEventReport() {
  const [events, setEvents] = useState([]);
  const [report, setReport] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchEvents();
  }, []);

  const generateReport = async (event) => {
    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", event.id)
    );

    const snap = await getDocs(q);
    const regs = snap.docs.map(d => d.data());

    const total = regs.length;
    const present = regs.filter(r => r.checkInStatus).length;
    const absent = total - present;

    const summary = `
Event Report: ${event.title}

Date: ${event.date}
Venue: ${event.venue}

Total Registrations: ${total}
Students Attended: ${present}
Students Absent: ${absent}

Summary:
The event "${event.title}" was successfully conducted with active student participation.
Attendance statistics indicate a healthy engagement level, making the event a success.
`;

    setReport(summary);
  };

  return (
    <AdminLayout>
      <h1>Event Report Generation</h1>

      <select
        style={{ padding: "10px", marginTop: "20px" }}
        onChange={(e) => {
          const ev = events.find(x => x.id === e.target.value);
          if (ev) generateReport(ev);
        }}
      >
        <option value="">Select Event</option>
        {events.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      {report && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            whiteSpace: "pre-line"
          }}
        >
          <h3>Generated Report</h3>
          <p>{report}</p>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminEventReport;
