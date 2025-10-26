import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../auth.scss";
import AlertModal from "../../components/alertModal";

export default function PasswordResetConfirmPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setModalMessage("Please enter a new password");
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/auth/password-reset/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setModalMessage(data.message || "Password successfully reset");
        setModalOpen(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setModalMessage(data.error || "Invalid or expired link");
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
      <h1 className="auth-title">Set New Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="auth-input" />
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>

      <AlertModal isOpen={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
    </div>
  );
}
