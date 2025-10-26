import { useLocation } from "react-router-dom";
import "./policy.scss";
import { useEffect } from "react";

function CookiePolicyPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="policy">
      <h1>The Cookie Scroll</h1>

      <p>As you journey through our dojo, we use small digital scrolls known as "cookies" and session data to make your path smoother and more secure. This document explains what they are and why we use them.</p>

      <h2>What Are These 'Scrolls' (Cookies)?</h2>
      <p>A cookie is a small piece of data stored on your device (computer or mobile) by your browser. It helps us remember information about you.</p>
      <p>We also use server-side "sessions," which are directly related. A session is how we remember who you are from one page to the next.</p>

      <h2>Why We Use Cookies and Sessions</h2>
      <p>Our use of this technology is strictly for essential functions. We do not use them for tracking or advertising.</p>
      <ul>
        <li>
          <strong>Authentication:</strong> This is the most important one. We use a secure, session-based cookie to verify that you are logged in. Without this, you would have to enter your name and password on every single page.
        </li>
        <li>
          <strong>Security:</strong> Our session data helps protect your account from unauthorized access and safeguards the integrity of the dojo.
        </li>
      </ul>

      <h2>Types of Cookies We Use</h2>
      <ul>
        <li>
          <strong>Essential Session Cookies:</strong> These are vital for you to move around the dojo and use its features, such as accessing secure areas. These are the cookies we use to manage your login. The dojo cannot function without them.
        </li>
      </ul>
      <p>Because we only use cookies that are strictly necessary for the site to function and to keep you logged in, we do not provide an option to disable them.</p>

      <h2>Managing Your Preferences</h2>
      <p>You can set your browser to block or alert you about these cookies, but please be aware that if you do, the core parts of the dojo (like logging in or posting) will cease to function, as we will be unable to recognize you as a valid student.</p>
    </div>
  );
}

export default CookiePolicyPage;
