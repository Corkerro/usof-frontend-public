import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.scss";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../features/auth/authSlice.js";
import AlertModal from "../components/alertModal/index.jsx";

export default function LoginPage() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginValue, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        const errText = errData.error || "Error";
        setAlertModal({ open: true, message: errText });
        return;
      }

      const data = await res.json();
      dispatch(loginAction(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setAlertModal({ open: true, message: "Error during login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <label>
          Login or Email
          <input type="text" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <button type="submit" disabled={loading} className="button">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="auth-links">
          <Link to="/register">Don’t have an account? Register</Link>
          <Link to="/password-reset">Forgot password?</Link>
        </div>
      </form>

      <AlertModal isOpen={alertModal.open} message={alertModal.message} onClose={() => setAlertModal({ open: false, message: "" })} />
    </div>
  );
}
