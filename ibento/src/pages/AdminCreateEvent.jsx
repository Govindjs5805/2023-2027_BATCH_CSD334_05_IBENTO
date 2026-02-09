import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        category,
        venue,
        createdAt: new Date()
      });

      alert("Event created successfully!");

      setTitle("");
      setDate("");
      setCategory("");
      setVenue("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AdminLayout>
      <h1>Create Event</h1>
      <p>Add a new campus event</p>

      <form onSubmit={handleCreateEvent} style={{ maxWidth: "400px" }}>
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
          placeholder="Category (Tech, Sports, Cultural)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </AdminLayout>
  );
}

export default AdminCreateEvent;
