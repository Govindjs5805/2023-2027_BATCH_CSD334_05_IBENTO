import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(list.slice(0, 3));
    };

    fetchEvents();
  }, []);

  return (
    <div className="home">

      <section className="hero">
  <div className="hero-content">
    <h1>Powering Campus Events</h1>
    <p>
      A centralized platform for discovering, organizing, 
      and tracking campus activities.
    </p>

    <div className="hero-buttons">
      <button onClick={() => navigate("/events")}>
        Explore Events
      </button>
      <button className="secondary">
        Learn More
      </button>
    </div>
  </div>
</section>

      <section className="preview" data-aos="fade-up">
        <h2>Upcoming Events</h2>
        <div className="preview-grid">
          {events.map(event => (
            <div key={event.id} className="preview-card">
              <img src={event.posterURL} alt="" />
              <h3>{event.title}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className="organizers">
  <h2>Our Organizers</h2>
  <div className="organizer-grid">
    <div className="org-card">Tech Club</div>
    <div className="org-card">Media Forum</div>
    <div className="org-card">Arts Association</div>
    <div className="org-card">Sports Council</div>
  </div>
</section>
<section className="cta">
  <h2>Ready to join the next big event?</h2>
  <button onClick={() => navigate("/events")}>
    View All Events
  </button>
</section>

    </div>
  );
}

export default Home;