import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";

function Ticket() {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const snap = await getDoc(doc(db, "registrations", registrationId));

        if (snap.exists()) {
          setRegistration({ id: snap.id, ...snap.data() });
        } else {
          console.error("Registration not found");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    if (registrationId) {
      fetchTicket();
    }
  }, [registrationId]);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading ticket...</div>;
  }

  if (!registration) {
    return <div style={{ padding: "40px" }}>Ticket not found.</div>;
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>{registration.eventTitle}</h2>
      <p><strong>Name:</strong> {registration.userName}</p>
      <p><strong>Email:</strong> {registration.userEmail}</p>

      <div style={{ margin: "30px 0" }}>
        <QRCodeCanvas value={registration.id} size={220} />
      </div>

      <p>Show this QR code at entry.</p>
    </div>
  );
}

export default Ticket;