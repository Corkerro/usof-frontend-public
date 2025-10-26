import { useState } from "react";
import "./style.scss";

export default function InfoBlock() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`info-block ${collapsed ? "collapsed" : ""}`}>
      <div className="info-block__top">
        <div className="info-block__top-left">
          <h1>
            Welcome to BugzillaSan
            <br />
            <span>The Dojo of Code Wisdom</span>
          </h1>
          <p>Before you post, read these teachings from the Ancient Scrolls</p>
        </div>
        <div className="info-block__top-right">
          <h3>Post wisely. Scroll gently. Help with honor.</h3>
          <p>Welcome, coder. Your journey begins now.</p>
          <button onClick={toggleCollapse} title={collapsed ? "Expand" : "Collapse"}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="var(--red-1)" />
            </svg>
          </button>
        </div>
      </div>

      <ul className="info-block__content">{!collapsed && ["One who asks must seek clarity, not chaos. Describe your code like a true sensei: with structure, humility, and stack traces.", "Reply not with flames, but with insight. Even a single line of wisdom can guide a lost junior through the fog of bugs.", "Duplicate posts dishonor the dojo. Seek before you summon.", "No warrior is born knowing regex. Respect the learning journey of others.", "Edit thy posts. The path to clean code begins with clean questions."].map((text, i) => <li key={i}>{text}</li>)}</ul>
    </div>
  );
}
