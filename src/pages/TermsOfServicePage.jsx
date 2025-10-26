import { useLocation } from "react-router-dom";
import "./policy.scss";
import { useEffect } from "react";

function TermsOfServicePage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="policy">
      <h1>The Code of Conduct</h1>

      <p>Greetings, student. By entering the BugzillaSan Dojo of Code Wisdom, you agree to walk a path of honor, respect, and discipline. This Code of Conduct outlines the rules of our community.</p>

      <h2>1. The Path of Honor (Your Responsibilities)</h2>
      <ul>
        <li>
          <strong>Respect All Students:</strong> Treat fellow students and masters with respect, even when you disagree. Constructive criticism is welcome; personal attacks are forbidden.
        </li>
        <li>
          <strong>Share Wisdom, Not Malice:</strong> Post content that is helpful, relevant, and constructive. Do not post spam, advertisements, or malicious links.
        </li>
        <li>
          <strong>Maintain Your Discipline:</strong> You are responsible for the security of your own account. Do not share your password.
        </li>
        <li>
          <strong>Be Truthful:</strong> Do not impersonate others or spread misinformation.
        </li>
      </ul>

      <h2>2. Prohibited Actions</h2>
      <p>Actions that bring dishonor to the dojo will result in expulsion (account termination):</p>
      <ul>
        <li>Harassment, bullying, or hate speech of any kind.</li>
        <li>Posting illegal, obscene, or defamatory content.</li>
        <li>Attempting to breach the dojo's defenses (hacking, exploiting vulnerabilities).</li>
        <li>Creating multiple accounts to evade discipline or spam the community.</li>
      </ul>

      <h2>3. The Wisdom You Share (Your Content)</h2>
      <p>You retain ownership of the wisdom (content) you create. However, by posting it in this dojo, you grant BugzillaSan a non-exclusive, worldwide, royalty-free license to display, reproduce, and distribute your content within the context of the dojo's operation.</p>

      <h2>4. Disclaimer of Wisdom (Limitation of Liability)</h2>
      <p>
        This dojo is a <strong>student project</strong>. The wisdom, code, and advice shared here are for educational and illustrative purposes only. The masters (administrators) of this dojo are not liable for any errors, omissions, or for any harm or loss incurred from following the advice found within these walls. Walk your own path and verify all knowledge.
      </p>

      <h2>5. The Master's Right (Termination)</h2>
      <p>We reserve the right to remove any content or expel any student (terminate any account) that violates this Code of Conduct, with or without notice.</p>

      <h2>Changes to The Code</h2>
      <p>This Code may be revised. Continued use of the dojo after revisions constitutes acceptance of the new Code of Conduct.</p>
    </div>
  );
}

export default TermsOfServicePage;
