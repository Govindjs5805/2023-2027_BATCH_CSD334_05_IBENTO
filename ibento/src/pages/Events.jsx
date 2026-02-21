import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));

      const eventList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const eventData = docSnap.data();

          const regQuery = query(
            collection(db, "registrations"),
            where("eventId", "==", docSnap.id)
          );

          const regSnap = await getDocs(regQuery);
          const registeredCount = regSnap.size;

          const remainingSeats =
            eventData.seatLimit - registeredCount;

          return {
            id: docSnap.id,
            ...eventData,
            registrationCount: registeredCount,
            remainingSeats,
          };
        })
      );

      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <h2>All Events</h2>

      <div className="events-grid">
        {events.map((event) => {
          const isFull = event.remainingSeats <= 0;

          return (
            <div
              key={event.id}
              className="event-card"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {event.posterURL && (
                <img
                  src={event.posterURL}
                  alt="Poster"
                  className="event-poster"
                />
              )}

              <div className="event-info">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Seats Left:</strong> {Math.max(event.remainingSeats, 0)}</p>

                {isFull && (
                  <span className="event-badge full">
                    Event Full
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Events;