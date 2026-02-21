import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  const [event, setEvent] = useState(null);
  const [registeredCount, setRegisteredCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
    };

    const fetchRegistrations = async () => {
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", id)
      );
      const regSnap = await getDocs(q);
      setRegisteredCount(regSnap.size);
    };

    fetchEvent();
    fetchRegistrations();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", id),
      where("userId", "==", user.uid)
    );

    const existing = await getDocs(q);

    if (!existing.empty) {
      alert("Already registered");
      return;
    }

    await addDoc(collection(db, "registrations"), {
      eventId: id,
      eventTitle: event.title,
      userId: user.uid,
      userName: userData?.fullName || "Student",
      userEmail: user.email,
      checkInStatus: false,
      registeredAt: new Date()
    });

    alert("Registration successful!");
    setRegisteredCount(prev => prev + 1);
  };

  if (!event) return <div style={{ padding: "40px" }}>Loading...</div>;

  const seatsLeft = event.seatLimit - registeredCount;
  const isFull = seatsLeft <= 0;

  return (
    <div className="event-details">

      <div className="event-details-container">

        <img src={event.posterURL} alt={event.title} />

        <div className="event-info">
          <h1>{event.title}</h1>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Organizer:</strong> {event.clubName}</p>

          <div className="seat-info">
            <span>Seats Left: {seatsLeft}</span>
          </div>

          <p className="description">{event.description}</p>

          {userData?.role === "student" && (
            <button 
              disabled={isFull}
              onClick={handleRegister}
            >
              {isFull ? "Event Full" : "Register Now"}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default EventDetails;