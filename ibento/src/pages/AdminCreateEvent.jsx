import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCreateEvent() {
  const { role, clubId, user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState(null);

  // ❌ Prevent access if not clubLead
  if (role !== "clubLead") {
    return (
      <AdminLayout>
        <h2 className="text-red-600 text-xl">
          Access Denied
        </h2>
      </AdminLayout>
    );
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      let posterURL = "";

      // Upload poster
      if (poster) {
        const posterRef = ref(
          storage,
          `eventFiles/${clubId}/${Date.now()}_${poster.name}`
        );
        await uploadBytes(posterRef, poster);
        posterURL = await getDownloadURL(posterRef);
      }

      // Save event
      await addDoc(collection(db, "events"), {
        title,
        date,
        venue,
        description,
        posterURL,
        clubId: clubId, // 🔥 IMPORTANT
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: "upcoming"
      });

      alert("Event created successfully!");
      navigate("/admin");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold mb-6">
          Create Event
        </h1>

        <form onSubmit={handleCreateEvent} className="space-y-4">

          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Venue"
            className="w-full p-2 border rounded"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />

          <textarea
            placeholder="Event Description"
            rows="4"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPoster(e.target.files[0])}
          />

          <button
            type="submit"
            className="bg-accent px-4 py-2 rounded font-semibold"
          >
            Create Event
          </button>

        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminCreateEvent;
