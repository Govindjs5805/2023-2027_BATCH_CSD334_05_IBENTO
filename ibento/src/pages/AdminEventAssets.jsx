import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

function EventDocumentUploader({ eventId }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("Event Photo");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    setUploading(true);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ibento_unsigned"); 

      const res = await fetch("https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      // 2. Save the URL to the specific Event document in Firestore
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        documents: arrayUnion({
          name: file.name,
          url: data.secure_url,
          type: docType,
          uploadedAt: new Date(),
        })
      });

      alert("Document uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
      <h4>Upload Event Documents</h4>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <select onChange={(e) => setDocType(e.target.value)} style={{ padding: "8px" }}>
          <option>Permission Letter</option>
          <option>Geotag Photo</option>
          <option>Event Photo</option>
          <option>Report PDF</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={uploading} style={{ background: "#198754", color: "white" }}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}