import logo from "/logo.svg";
import "./style.scss";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <p>
            Crafted with honor as a{" "}
            <a href="https://campus.kpi.kharkov.ua/" target="_blank" rel="noopener noreferrer">
              student project
            </a>
          </p>

          <ul>
            <li>
              <a href="https://github.com/Corkerro/usof-frontend-public" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </li>
            <li>
              <a href="https://github.com/Corkerro/usof-backend-public" target="_blank" rel="noopener noreferrer">
                Backend Repository
              </a>
            </li>
          </ul>

          <ul>
            <li>
              <Link to={"/privacy"}>Privacy Policy</Link>
            </li>
            <li>
              <Link to={"/terms"}>Terms and Conditions</Link>
            </li>
            <li>
              <Link to={"/cookie"}>Cookie Policy</Link>
            </li>
          </ul>

          <p>© {new Date().getFullYear()} BugzillaSan — Dojo of Code Wisdom</p>

          <p>
            We use cookies and session data to keep your path steady and your login safe. 🍪 Learn more in our <Link to={"/cookie"}>Cookie Scroll</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
