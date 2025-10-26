// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import "./auth.scss";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found" style={{ textAlign: "center" }}>
      <div className="not-found-content">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for doesn’t exist or has been moved.</p>
        <button className="auth-btn button" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
}
