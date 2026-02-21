import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Html5Qrcode } from "html5-qrcode";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCheckIn() {
  const { clubId } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

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

  useEffect(() => {
    if (!selectedEvent) return;
    if (startedRef.current) return;

    startedRef.current = true;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },

      async (decodedText) => {
        try {
          const regRef = doc(db, "registrations", decodedText);
          const regSnap = await getDoc(regRef);

          if (!regSnap.exists()) {
            alert("Invalid Ticket ❌");
            return;
          }

          const regData = regSnap.data();

          if (regData.eventId !== selectedEvent) {
            alert("Wrong Event Ticket ❌");
            return;
          }

          if (regData.checkInStatus) {
            alert("Already Checked In ⚠️");
            return;
          }

          await updateDoc(regRef, {
            checkInStatus: true,
            checkInTime: serverTimestamp()
          });

          alert("Attendance Marked ✅");

        } catch (error) {
          console.error(error);
        }
      }
    ).catch(err => {
      console.error(err);
    });

    return () => {
      if (scannerRef.current) {
        try {
          const state = scannerRef.current.getState();
          if (state === 2) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch {}
      }
    };

  }, [selectedEvent]);

  return (
    <AdminLayout>
      <h2>Check-In System</h2>

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
        <>
          <h3>Scanning for Event</h3>
          <div id="reader" style={{ width: "300px", marginTop: "20px" }}></div>
        </>
      )}

    </AdminLayout>
  );
}

export default AdminCheckIn;