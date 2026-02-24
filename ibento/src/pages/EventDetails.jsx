import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, userData } = useAuth(); // Using role directly from context

  const [event, setEvent] = useState(null);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
    };

    const fetchRegistrations = async () => {
      const q = query(collection(db, "registrations"), where("eventId", "==", id));
      const regSnap = await getDocs(q);
      setRegisteredCount(regSnap.size);

      if (user) {
        // Look for the specific registration for this user
        const userReg = regSnap.docs.find(doc => doc.data().userId === user.uid);
        if (userReg) {
          setAlreadyRegistered(true);
          setCheckedIn(userReg.data().checkInStatus || false);
        }
      }
    };

    fetchEvent();
    fetchRegistrations();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addDoc(collection(db, "registrations"), {
        eventId: id,
        eventTitle: event.title,
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Student",
        userEmail: user.email,
        checkInStatus: false,
        registeredAt: new Date()
      });

      alert("Registration successful!");
      setAlreadyRegistered(true);
      setRegisteredCount(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  if (!event) return <div style={{ padding: "40px" }}>Loading...</div>;

  // Logic for dates and seats
  const today = new Date().toISOString().split("T")[0];
  const isPastEvent = event.date < today;
  const seatsLeft = event.seatLimit - registeredCount;

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
            <span>Seats Left: {seatsLeft > 0 ? seatsLeft : 0}</span>
          </div>

          <p className="description">{event.description}</p>

          <div style={{ marginTop: "30px" }}>
            {user ? (
              // Case 1: User is logged in as a student
              role === "student" ? (
                <>
                  {isPastEvent ? (
                    alreadyRegistered ? (
                      <button 
                        onClick={() => navigate(`/feedback/${id}`)}
                        style={{ background: "#ffc107", color: "black" }}
                      >
                        Give Feedback ⭐
                      </button>
                    ) : (
                      <button disabled style={{ background: "#6c757d" }}>
                        Event Expired
                      </button>
                    )
                  ) : alreadyRegistered ? (
                    <button disabled style={{ background: "#198754", opacity: 0.7 }}>
                      Already Registered ✅
                    </button>
                  ) : seatsLeft > 0 ? (
                    <button onClick={handleRegister} className="register-btn">
                      Register Now
                    </button>
                  ) : (
                    <button disabled style={{ background: "red" }}>
                      Sold Out
                    </button>
                  )}
                </>
              ) : (
                // Case 2: User is logged in as Admin/ClubLead
                <p style={{ color: "#666", fontStyle: "italic" }}>
                  Logged in as {role}. Admins cannot register.
                </p>
              )
            ) : (
              // Case 3: Guest User
              <button onClick={() => navigate("/login")} className="register-btn">
                Login to Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;