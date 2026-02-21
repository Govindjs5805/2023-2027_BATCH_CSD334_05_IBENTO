import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

function AdminScanner() {
  const { role } = useAuth();
  const { eventId } = useParams();
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (role !== "clubLead") return;
    if (startedRef.current) return;

    startedRef.current = true;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
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

            // 🔥 Check event match
            if (regData.eventId !== eventId) {
              alert("This ticket does not belong to this event ❌");
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
      )
      .catch((err) => {
        console.error("Scanner start error:", err);
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
  }, [role, eventId]);

  if (role !== "clubLead") {
    return <h2>Access Denied</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Scanning for Event ID: {eventId}</h2>
      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}

export default AdminScanner;