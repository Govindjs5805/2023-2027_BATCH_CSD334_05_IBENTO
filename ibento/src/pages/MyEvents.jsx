import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;

      const q = query(
        collection(db, "registrations"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRegistrations(list);
    };

    fetchRegistrations();
  }, [user]);

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Events</h2>

      {registrations.map(reg => (
        <div key={reg.id} style={{
          background: "#f5f5f5",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "10px"
        }}>
          <h3>{reg.eventTitle}</h3>
          <p>Registered on: {reg.registeredAt?.toDate?.().toLocaleDateString?.() || "N/A"}</p>
          <p>
            Status: {reg.checkInStatus ? "Checked In" : "Not Checked In"}
          </p>

          <button
            onClick={() => navigate(`/ticket/${reg.id}`)}
          >
            View Ticket
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyEvents;