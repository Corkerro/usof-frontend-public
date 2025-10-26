import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.scss";
import AlertModal from "../../components/alertModal";

export default function DeleteAccountPage() {
  const currentUser = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", onClose: null });
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") || "";
  const [tokenInput, setTokenInput] = useState(initialToken);

  useEffect(() => {
    if (initialToken) handleDelete(initialToken);
  }, [initialToken]);

  const handleDelete = async (tokenValue) => {
    if (!currentUser?.id) {
      setAlert({ open: true, message: "User not logged in" });
      return;
    }
    if (!tokenValue.trim()) {
      setAlert({ open: true, message: "No deletion token provided" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${currentUser.id}/confirm-deletion`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenValue }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({
          open: true,
          message: data.message || "Account deleted successfully",
          onClose: () => navigate("/logout"),
        });

        // Автоматический переход через 5 секунд
        setTimeout(() => navigate("/logout"), 5000);
      } else {
        setAlert({ open: true, message: data.error || "Unauthorized" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-page-wrapper">
      <div className="delete-page">
        <h1>Delete Account</h1>
        <p>Enter your deletion token to permanently delete your account.</p>
        <input
          type="text"
          placeholder="Deletion token"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          readOnly={!!initialToken} // readonly только если токен пришел из URL
          className="auth-input"
        />
        {!initialToken && (
          <button onClick={() => handleDelete(tokenInput)} disabled={loading} className="auth-btn button">
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        )}
      </div>

      <AlertModal
        isOpen={alert.open}
        message={alert.message}
        onClose={() => {
          if (alert.onClose) alert.onClose();
          setAlert({ open: false, message: "", onClose: null });
        }}
      />
    </div>
  );
}
