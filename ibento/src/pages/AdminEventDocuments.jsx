import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminEventDocuments() {
  const { clubId } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("Event Photo");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("clubId", "==", clubId));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (clubId) fetchEvents();
  }, [clubId]);

  useEffect(() => {
    const ev = events.find(e => e.id === selectedEventId);
    setSelectedEventData(ev || null);
  }, [selectedEventId, events]);

  const handleUpload = async () => {
    if (!file || !selectedEventId) return alert("Select an event and a file!");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ibento_unsigned"); 

      const res = await fetch("https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const eventRef = doc(db, "events", selectedEventId);
      const newDoc = {
        name: file.name,
        url: data.secure_url,
        type: docType,
        uploadedAt: new Date().toISOString(),
      };

      await updateDoc(eventRef, {
        documents: arrayUnion(newDoc)
      });

      // Update local state UI
      setSelectedEventData(prev => ({
        ...prev,
        documents: prev.documents ? [...prev.documents, newDoc] : [newDoc]
      }));

      alert("Document uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (docToDelete) => {
    if (!window.confirm(`Are you sure you want to delete "${docToDelete.name}"?`)) return;

    try {
      const eventRef = doc(db, "events", selectedEventId);
      
      // Remove from Firestore array
      await updateDoc(eventRef, {
        documents: arrayRemove(docToDelete)
      });

      // Update local state UI immediately
      setSelectedEventData(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.url !== docToDelete.url)
      }));

      alert("Document deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document.");
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Event Document Vault 📁</h2>
        
        <select 
          onChange={(e) => setSelectedEventId(e.target.value)}
          style={{ padding: "10px", width: "100%", maxWidth: "400px", margin: "20px 0", borderRadius: "8px" }}
        >
          <option value="">-- Select Event --</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>

        {selectedEventId && (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h3>Management for: {selectedEventData?.title}</h3>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "20px 0", alignItems: "center" }}>
              <select onChange={(e) => setDocType(e.target.value)} style={{ padding: "8px", borderRadius: "5px" }}>
                <option>Permission Letter</option>
                <option>Geotag Photo</option>
                <option>Event Photo</option>
                <option>Budget Report</option>
              </select>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleUpload} disabled={uploading} style={{ background: "#198754", color: "white", padding: "8px 20px", border: "none", borderRadius: "5px" }}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <hr />

            <h4>Uploaded Documents</h4>
            <div style={{ marginTop: "15px" }}>
              {selectedEventData?.documents?.length > 0 ? (
                selectedEventData.documents.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid #eee" }}>
                    <span><strong>[{d.type}]</strong> {d.name}</span>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <a href={d.url} target="_blank" rel="noreferrer" style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "bold" }}>View</a>
                      <button 
                        onClick={() => handleDelete(d)}
                        style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: "1.1rem" }}
                        title="Delete Document"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#888" }}>No documents uploaded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEventDocuments;