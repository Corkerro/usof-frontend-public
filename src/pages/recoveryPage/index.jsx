import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.scss";
import AlertModal from "../../components/alertModal";

export default function RecoveryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", onClose: null });

  useEffect(() => {
    if (token) handleConfirm(token);
  }, [token]);

  const handleRequest = async () => {
    if (!email.trim()) {
      setAlert({ open: true, message: "Please enter your email" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      setAlert({
        open: true,
        message: data.message || "Recovery instructions have been sent",
        onClose: () => navigate("/login"), // переход на login при закрытии
      });

      // автоматический переход через 5 секунд
      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (tokenValue) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/recovery/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({
          open: true,
          message: data.message || "Account recovered successfully",
          onClose: () => navigate("/login"),
        });
      } else {
        setAlert({ open: true, message: data.error || "Invalid or expired token" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-page-wrapper">
      <div className="recovery-page">
        {!token ? (
          <>
            <h1>Account Recovery</h1>
            <p>Enter your email to receive account recovery instructions.</p>
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
            <button onClick={handleRequest} disabled={loading} className="auth-btn button">
              {loading ? "Sending..." : "Send Recovery Email"}
            </button>
          </>
        ) : (
          <>
            <h1>Recover Account</h1>
            <p>Processing your recovery request...</p>
          </>
        )}

        <AlertModal
          isOpen={alert.open}
          message={alert.message}
          onClose={() => {
            if (alert.onClose) alert.onClose();
            setAlert({ open: false, message: "", onClose: null });
          }}
        />
      </div>
    </div>
  );
}
