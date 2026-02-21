import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { eventId } = useParams();
  const { user, fullName } = useAuth();

  const [event, setEvent] = useState(null);
  const [club, setClub] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch event + club
  useEffect(() => {
    const fetchEvent = async () => {
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        setEvent(eventData);

        // Fetch club info
        if (eventData.clubId) {
          const clubSnap = await getDoc(
            doc(db, "clubs", eventData.clubId)
          );
          if (clubSnap.exists()) {
            setClub(clubSnap.data());
          }
        }
      }

      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  // 🔹 Fetch registrations count
  useEffect(() => {
    const fetchRegistrations = async () => {
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId)
      );

      const snapshot = await getDocs(q);
      setRegistrationCount(snapshot.size);
    };

    fetchRegistrations();
  }, [eventId]);

  // 🔹 Check if already registered
  useEffect(() => {
    if (!user) return;

    const checkUserRegistration = async () => {
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setRegistered(true);
      }
    };

    checkUserRegistration();
  }, [user, eventId]);

  const isEventOver = () => {
    if (!event?.date) return false;
    const today = new Date();
    const eventDate = new Date(event.date);
    return eventDate < today;
  };

  const isFull =
    event && registrationCount >= event.seatLimit;

  const remainingSeats =
    event ? event.seatLimit - registrationCount : 0;

  const handleRegister = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const regQuery = query(
          collection(db, "registrations"),
          where("eventId", "==", eventId)
        );

        const regSnap = await getDocs(regQuery);

        if (regSnap.size >= event.seatLimit) {
          throw "Event Full";
        }

        const newRegRef = doc(collection(db, "registrations"));

        transaction.set(newRegRef, {
          eventId,
          userId: user.uid,
          userEmail: user.email,
          userName: fullName,
          checkInStatus: false,
          checkInTime: null,
          registeredAt: serverTimestamp(),
        });
      });

      alert("Successfully Registered!");
      setRegistered(true);
      setRegistrationCount((prev) => prev + 1);

    } catch (error) {
      alert("Event is full!");
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!event) return <p style={{ padding: "40px" }}>Event not found</p>;

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        
        {/* Poster */}
        {event.posterURL && (
          <img
            src={event.posterURL}
            alt="Event Poster"
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          />
        )}

        <h1>{event.title}</h1>

        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Venue:</strong> {event.venue}</p>

        <p><strong>Total Registered:</strong> {registrationCount}</p>
        <p><strong>Seats Left:</strong> {Math.max(remainingSeats, 0)}</p>

        {/* Club Info */}
        {club && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "15px 0",
            }}
          >
            {club.logoURL && (
              <img
                src={club.logoURL}
                alt="Club Logo"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <span style={{ fontWeight: "bold" }}>{club.name}</span>
          </div>
        )}

        <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
          {event.description}
        </p>

        <div style={{ marginTop: "35px" }}>
          {isEventOver() ? (
            <button disabled>Event Completed</button>
          ) : isFull ? (
            <button disabled>Event Full</button>
          ) : registered ? (
            <button disabled>Already Registered</button>
          ) : (
            <button onClick={handleRegister}>
              Register Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;