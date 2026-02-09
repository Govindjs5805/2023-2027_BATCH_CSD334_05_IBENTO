import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function EditProfile() {
  const { user, fullName } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setName(snap.data().fullName || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName: name
      });

      alert("Profile updated successfully!");
      window.location.reload(); // refresh context data
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading profile...</p>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h1>Edit Profile</h1>
      <p>Update your personal details</p>

      <form onSubmit={handleUpdate}>
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={user.email}
          disabled
        />

        <button type="submit" style={{ marginTop: "15px" }}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
