import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Feedback() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        eventId,
        userId: user.uid,
        userName: user.displayName || "Student",
        rating,
        comment,
        submittedAt: serverTimestamp(),
      });
      alert("Feedback submitted! Thank you.");
      navigate("/my-events");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Event Feedback 🌟</h2>
      <p style={{ color: "#666" }}>How was your experience? Your feedback helps us improve!</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p>Rating: {rating} / 5</p>
          <input 
            type="range" min="1" max="5" value={rating} 
            onChange={(e) => setRating(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#198754" }}
          />
        </div>
        
        <textarea
          placeholder="Write your thoughts here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          style={{ width: "100%", height: "120px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        
        <button 
          type="submit" 
          disabled={submitting}
          style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#198754", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;