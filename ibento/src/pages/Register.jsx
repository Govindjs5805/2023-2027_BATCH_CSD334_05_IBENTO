import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;
    console.log("UID:", uid);

    await setDoc(doc(db, "users", uid), {
      fullName: fullName,
      email: email,
      role: "student",
      createdAt: new Date()
    });

    alert("Registration successful!");
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    alert(error.message);
  }
};


  return (
    <div style={{ padding: "60px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type = "text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required

        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          required
        />

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
