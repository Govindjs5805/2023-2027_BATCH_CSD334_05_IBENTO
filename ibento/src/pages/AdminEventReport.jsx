import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function AdminEventReport() {
  const { clubId } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventData, setEventData] = useState(null);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  // Load events
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

  // Load report data
  useEffect(() => {
    const loadReport = async () => {
      if (!selectedEvent) return;

      // Event details
      const eventSnap = await getDoc(doc(db, "events", selectedEvent));
      if (eventSnap.exists()) {
        setEventData(eventSnap.data());
      }

      // Registrations
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

    loadReport();
  }, [selectedEvent]);

  const attendancePercentage =
    totalRegistrations > 0
      ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1)
      : 0;

  const downloadPDF = async () => {
    const input = document.getElementById("report-content");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("event-report.pdf");
  };

  return (
    <AdminLayout>
      <h2>Event Report</h2>

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

      {selectedEvent && eventData && (
        <>
          <div
            id="report-content"
            style={{
              background: "#ffffff",
              padding: "30px",
              marginTop: "30px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{eventData.title}</h3>
            <p><strong>Date:</strong> {eventData.date}</p>
            <p><strong>Venue:</strong> {eventData.venue}</p>
            <p><strong>Description:</strong> {eventData.description}</p>

            <hr />

            <p><strong>Total Registrations:</strong> {totalRegistrations}</p>
            <p><strong>Total Checked-In:</strong> {totalCheckedIn}</p>
            <p><strong>Attendance %:</strong> {attendancePercentage}%</p>

            <hr />

            <p>
              <strong>Generated On:</strong>{" "}
              {new Date().toLocaleString()}
            </p>
          </div>

          <button
            onClick={downloadPDF}
            style={{ marginTop: "20px" }}
          >
            Download PDF Report
          </button>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminEventReport;