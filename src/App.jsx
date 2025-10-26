import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./widgets/header";
import LeftSide from "./widgets/leftSide";
import MainContent from "./widgets/mainContent";
import PostPage from "./pages/postPage";
import LoginPage from "./pages/LoginPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";
import CreatePost from "./pages/createPost/index.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { login, logout } from "./features/auth/authSlice.js";
import PasswordResetRequestPage from "./pages/passwordReset/PasswordResetRequestPage.jsx";
import PasswordResetConfirmPage from "./pages/passwordReset/PasswordResetConfirmPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import { API_URL } from "./app/config.js";
import ProfilePage from "./pages/profilePage";
import CategoryPage from "./pages/categoryPage/index.jsx";
import DeleteAccountPage from "./pages/deleteAccountPage";
import RecoveryPage from "./pages/recoveryPage/index.jsx";
import Footer from "./widgets/footer/index.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPage.jsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx";
import CookiePolicyPage from "./pages/CookiePolicyPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/sessions/current`, {
          credentials: "include",
        });

        const session = await res.json();

        if (session.error === "Unauthorized") {
          dispatch(logout());
          return;
        }

        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (!savedUser?.id) {
          dispatch(logout());
          return;
        }

        const userRes = await fetch(`${API_URL}/users/${savedUser.id}`, {
          credentials: "include",
        });

        if (!userRes.ok) {
          dispatch(logout());
          return;
        }

        const userData = await userRes.json();
        dispatch(login(userData));
      } catch (err) {
        console.error("Ошибка при проверке сессии:", err);
        dispatch(logout());
      }
    };

    checkSession();
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <main className="main">
        <div className="main__container">
          <LeftSide />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/password-reset" element={<PasswordResetRequestPage />} />
            <Route path="/password-reset/:token" element={<PasswordResetConfirmPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/cookie" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
