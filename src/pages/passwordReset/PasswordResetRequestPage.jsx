import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth.scss";
import AlertModal from "../../components/alertModal";

export default function PasswordResetRequestPage() {
  const [login, setLogin] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login.trim()) {
      setModalMessage("Please enter your login or email");
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login }),
      });
      const data = await res.json();

      if (res.ok) {
        setModalMessage(data.message || "Password reset email sent");
        setModalOpen(true);
      } else {
        setModalMessage(data.error || "Something went wrong");
        setModalOpen(true);
      }
    } catch (err) {
      setModalMessage("Network error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex">
      <h1 className="auth-title">Reset Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your login or email" value={login} onChange={(e) => setLogin(e.target.value)} className="auth-input" />
        <button type="submit" disabled={loading} className="auth-btn button">
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
        <button onClick={() => navigate("/login")} className="auth-link">
          Back to Login
        </button>
      </form>

      <AlertModal isOpen={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
    </div>
  );
}
