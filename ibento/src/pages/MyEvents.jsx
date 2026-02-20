import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";

function MyEvents() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "registrations"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const regList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRegistrations(regList);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchRegistrations();
  }, [user]);

  if (!user) {
    return <h2 style={{ padding: "20px" }}>Please login first</h2>;
  }

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading your events...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>My Registered Events</h1>

      {registrations.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {registrations.map(reg => (
            <div
              key={reg.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                background: "#fff"
              }}
            >
              <h3>{reg.eventTitle}</h3>

              <p><strong>Registered As:</strong> {reg.userName}</p>

              <p>
                <strong>Status:</strong>{" "}
                {reg.checkInStatus ? "Checked In ✅" : "Not Checked In"}
              </p>

              {reg.checkInTime && (
                <p>
                  <strong>Check-in Time:</strong>{" "}
                  {new Date(reg.checkInTime.seconds * 1000).toLocaleString()}
                </p>
              )}

              <div style={{ marginTop: "15px" }}>
                <QRCodeCanvas value={reg.id} size={150} />
              </div>

              <p style={{ fontSize: "12px", marginTop: "10px" }}>
                Show this QR at event entrance
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;