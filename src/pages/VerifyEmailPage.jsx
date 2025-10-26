import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./auth.scss";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing token");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully");
        } else {
          setStatus("error");
          setMessage(data.error || data.message || "Verification failed");
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setStatus("error");
        setMessage("Server error during verification");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-form">
        {status === "loading" ? (
          <>
            <h2>Verifying Email...</h2>
            <p>Please wait while we confirm your email address.</p>
          </>
        ) : status === "success" ? (
          <>
            <h2>Email Verified</h2>
            <p style={{ textAlign: "center" }}>{message}</p>
            <div className="auth-links">
              <Link to="/login">Go to Login</Link>
            </div>
          </>
        ) : (
          <>
            <h2>Verification Failed</h2>
            <p style={{ textAlign: "center" }}>{message}</p>
            <div className="auth-links">
              <Link to="/login">Try Again</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
