import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        navigate("/verify-email");
        setLoading(false);
        return;
      }

      localStorage.setItem("role", "student");

      navigate("/home");
    } catch {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top left, #1e1b4b, #0f0c29);
          padding: 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 18px;
          background: rgba(30, 27, 75, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
          text-align: center;
        }

        .auth-card h2 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #c4b5fd;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin-bottom: 25px;
        }

        .auth-card input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          outline: none;
          font-size: 14px;
          transition: 0.3s;
        }

        .auth-card input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
        }

        .auth-card button {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .auth-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-card button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.5);
        }

        .auth-error {
          background: rgba(255, 0, 0, 0.2);
          color: #f87171;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 13px;
        }

        .auth-footer {
          margin-top: 20px;
          font-size: 14px;
          color: #a1a1aa;
        }

        .auth-footer a {
          color: #a855f7;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue ✨</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;