import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCreateEvent() {
  const { clubId } = useAuth();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [seatLimit, setSeatLimit] = useState("");
  const [posterURL, setPosterURL] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        venue,
        description,
        seatLimit: Number(seatLimit),
        posterURL,
        clubId,
        createdAt: serverTimestamp(),
      });

      alert("Event Created Successfully!");

      setTitle("");
      setDate("");
      setVenue("");
      setDescription("");
      setSeatLimit("");
      setPosterURL("");

    } catch (error) {
      console.error(error);
      alert("Error creating event");
    }
  };

  return (
    <AdminLayout>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Seat Limit"
          value={seatLimit}
          onChange={(e) => setSeatLimit(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Poster URL"
          value={posterURL}
          onChange={(e) => setPosterURL(e.target.value)}
        />

        <button type="submit">Create Event</button>
      </form>
    </AdminLayout>
  );
}

export default AdminCreateEvent;