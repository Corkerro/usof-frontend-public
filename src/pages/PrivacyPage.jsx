import { useLocation } from "react-router-dom";
import "./policy.scss";
import { useEffect } from "react";

function PrivacyPolicyPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="policy">
      <h1>The Scroll of Privacy</h1>

      <p>Welcome, student, to the BugzillaSan Dojo of Code Wisdom. Your privacy is a sacred trust. This Scroll outlines how we handle your personal information.</p>

      <h2>1. The Information We Collect</h2>
      <p>To walk the path of this dojo, we must know your name. We collect only the information essential for your training:</p>
      <ul>
        <li>
          <strong>Account Information:</strong> Your chosen username, a secure (hashed) password, and your email address. We need your email to verify your account and help you reset your password if your focus falters.
        </li>
        <li>
          <strong>Your Contributions:</strong> Any posts, comments, or code snippets you share in the dojo are stored as part of our shared wisdom.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>Your information is used only for honorable purposes:</p>
      <ul>
        <li>To grant you access to the dojo and manage your student account.</li>
        <li>To display your contributions and attribute them to you.</li>
        <li>To communicate with you about essential account matters (e.g., password resets, email verification).</li>
      </ul>

      <h2>3. The Information We Do Not Collect</h2>
      <p>We do not collect personal data that is not relevant to your training. We do not track your activity outside of this dojo. We do not engage in the dishonorable practice of selling student data.</p>

      <h2>4. How We Protect Your Information</h2>
      <p>Your digital scroll (data) is protected with strong measures. Passwords are never stored in plain text; they are protected using modern hashing techniques.</p>
      <p>
        This dojo is a <strong>student project</strong>. While we strive to protect your data, we cannot offer the impenetrable defenses of a massive fortress. Please be mindful of the information you share.
      </p>

      <h2>5. Your Control Over Your Scroll</h2>
      <p>You have the right to view, update, or request the deletion of your personal information. You can manage your account details through your profile or request account deletion through the provided channels.</p>

      <h2>Changes to This Scroll</h2>
      <p>As the dojo evolves, this Scroll of Privacy may be updated. We will notify you of any significant changes.</p>
    </div>
  );
}

export default PrivacyPolicyPage;
