import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../app/config";
import "./auth.scss";

export default function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        dispatch(logout());
        navigate("/login");
      } catch (err) {
        console.error("Logout error:", err);
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <p>Logging out...</p>
    </div>
  );
}
