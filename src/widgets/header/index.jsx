import logo from "/logo.svg";
import "./style.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchInput from "../../components/searchInput";

function Header() {
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${user.id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [user]);

  const getRoleName = (roleId) => {
    if (roleId === 1) return "Admin";
    if (roleId === 2) return "User";
    return "Unknown";
  };

  const defaultAvatar = "https://cdn-icons-png.freepik.com/512/6596/6596121.png";

  const avatarUrl = userData?.avatarUrl ? `http://localhost:3000${userData.avatarUrl}` : defaultAvatar;

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="header__center">
          <SearchInput placeholder="Search posts..." />
        </div>

        <div className="header__right">
          {!user ? (
            <Link to="/register" className="button header__right-button">
              Register
            </Link>
          ) : (
            <div className="header__user-info">
              <div className="header__user-details">
                <Link to={`/profile/${user.id}`} className="header__login">
                  {user.login}
                </Link>
                <span className="header__role">{userData?.roleId == 1 ? <a href="http://localhost:3000/admin">{getRoleName(userData?.roleId)}</a> : getRoleName(userData?.roleId)}</span>
              </div>
              <Link to={`/profile/${user.id}`} className="header__avatar-link">
                <img src={avatarUrl} alt="Avatar" className="header__avatar" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
