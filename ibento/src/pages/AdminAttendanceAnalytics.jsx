import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../components/Admin/AdminLayout";
import Chart from "chart.js/auto";

function AdminAttendanceAnalytics() {
  const [events, setEvents] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchEvents();
  }, []);

  const generateAnalytics = async (event) => {
    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", event.id)
    );

    const snap = await getDocs(q);
    const regs = snap.docs.map(d => d.data());

    const total = regs.length;
    const present = regs.filter(r => r.checkInStatus).length;
    const absent = total - present;

    // Destroy old chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Registered", "Present", "Absent"],
        datasets: [
          {
            label: "Student Count",
            data: [total, present, absent],
            backgroundColor: ["#4CAF50", "#2196F3", "#F44336"]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  };

  return (
    <AdminLayout>
      <h1>Attendance Analytics</h1>
      <p>Visual attendance summary</p>

      <select
        style={{ padding: "10px", marginTop: "20px" }}
        onChange={(e) => {
          const ev = events.find(x => x.id === e.target.value);
          if (ev) generateAnalytics(ev);
        }}
      >
        <option value="">Select Event</option>
        {events.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "40px", maxWidth: "600px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </AdminLayout>
  );
}

export default AdminAttendanceAnalytics;
