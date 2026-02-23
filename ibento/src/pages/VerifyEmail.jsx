import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Waiting for verification...");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const interval = setInterval(async () => {
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        setMessage("Email verified successfully! Redirecting...");
        clearInterval(interval);
        setChecking(false);

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleResend = async () => {
    if (resendCooldown > 0 || !auth.currentUser) return;

    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("Verification email resent successfully.");
      setResendCooldown(30);

      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch {
      setMessage("Failed to resend verification email.");
    }
  };

  return (
    <>
      <style>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top left, #1e1b4b, #0f0c29);
          padding: 20px;
        }

        .verify-card {
          background: rgba(30, 27, 75, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
          padding: 40px;
          border-radius: 18px;
          text-align: center;
          width: 420px;
          color: white;
        }

        .verify-card h2 {
          color: #c4b5fd;
          margin-bottom: 15px;
        }

        .verify-card p {
          color: #a1a1aa;
          margin-bottom: 25px;
        }

        .verify-card button {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        .verify-card button:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.5);
        }

        .verify-card button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-message {
          margin-top: 20px;
          font-size: 14px;
          color: #a1a1aa;
        }

        .success-message {
          color: #4ade80;
        }
      `}</style>

      <div className="verify-container">
        <div className="verify-card">
          <h2>Verify Your Email</h2>
          <p>
            A verification link has been sent to your email.
            Please verify your account before continuing.
          </p>

          <button onClick={handleResend} disabled={resendCooldown > 0}>
            {resendCooldown > 0
              ? `Resend available in ${resendCooldown}s`
              : "Resend Verification Email"}
          </button>

          <div
            className={`status-message ${
              message.includes("successfully") ? "success-message" : ""
            }`}
          >
            {checking ? "Checking verification status..." : message}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;