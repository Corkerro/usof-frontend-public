import { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.scss";
import AlertModal from "../components/alertModal";

export default function RegisterPage() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  // ✅ Password validation function
  const validatePassword = (password) => {
    const minLength = /.{6,}/; // at least 6 characters
    const hasUppercase = /[A-Z]/; // at least one uppercase letter
    const hasLowercase = /[a-z]/; // at least one lowercase letter
    const hasNumber = /\d/; // at least one digit
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // at least one special char

    if (!minLength.test(password)) return "Password must be at least 6 characters long.";
    if (!hasUppercase.test(password)) return "Password must contain at least one uppercase letter.";
    if (!hasLowercase.test(password)) return "Password must contain at least one lowercase letter.";
    if (!hasNumber.test(password)) return "Password must contain at least one number.";
    if (!hasSpecialChar.test(password)) return "Password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Run password validation before sending
    const validationError = validatePassword(password);
    if (validationError) {
      setAlertModal({ open: true, message: validationError });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, email, password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setAlertModal({ open: true, message: "Registration failed: " + errText });
        return;
      }

      setAlertModal({
        open: true,
        message: `Registration successful! A verification email has been sent to ${email}`,
      });
      setLogin("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Register error:", err);
      setAlertModal({ open: true, message: "Error during registration" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>
          Username
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 chars, 1 uppercase, 1 number, 1 special" />
        </label>

        <button type="submit" disabled={loading} className="button">
          {loading ? "Creating..." : "Register"}
        </button>

        <div className="auth-links">
          <Link to="/login">Already have an account? Sign In</Link>
        </div>
      </form>

      <AlertModal isOpen={alertModal.open} message={alertModal.message} onClose={() => setAlertModal({ open: false, message: "" })} />
    </div>
  );
}
