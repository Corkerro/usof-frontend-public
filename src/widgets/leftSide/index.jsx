import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./style.scss";

import { fetchFavorites, removeFavorite } from "../../app/store/favoritesSlice";
import ConfirmModal from "../../components/сonfirmModal";

export default function LeftSide() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorCats, setErrorCats] = useState(null);
  const [userData, setUserData] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    postId: null,
  });

  const currentUser = useSelector((state) => state.auth.user);
  const { items: favorites, loading: loadingFavs, error: errorFavs } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.innerWidth <= 516) setIsCollapsed(true);
  }, []);

  // --- Fetch categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories?page=1&pageSize=50&sort=desc", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setErrorCats("Failed to load categories");
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  // --- Fetch favorite posts ---
  useEffect(() => {
    if (currentUser) dispatch(fetchFavorites());
  }, [currentUser, dispatch]);

  // --- Fetch full user info (rating) ---
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [currentUser]);

  // --- Modal handlers ---
  const handleRemoveFavorite = (postId) => {
    setConfirmModal({ open: true, postId });
  };

  const confirmRemove = () => {
    if (confirmModal.postId) dispatch(removeFavorite(confirmModal.postId));
    setConfirmModal({ open: false, postId: null });
  };

  const cancelRemove = () => {
    setConfirmModal({ open: false, postId: null });
  };

  return (
    <>
      <aside className={`left-side ${isCollapsed ? "collapsed" : ""}`}>
        <button className="left-side__toggle" onClick={() => setIsCollapsed((prev) => !prev)}>
          {isCollapsed ? "👉" : "👈"}
        </button>

        <div className="left-side__content">
          {currentUser ? (
            <div className="left-side__top">
              {currentUser && (
                <div className="left-side__top-down">
                  {userData && (
                    <div className="left-side__rating">
                      🌟 Your rating: <strong>{userData.rating}</strong>
                    </div>
                  )}

                  <Link to="/create-post" className="button left-side__button">
                    Create Post
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="left-side__top">
              {!currentUser && (
                <div className="left-side__top-top">
                  <h2>
                    Code with <span>discipline</span>. Debug with <span>honor</span>.
                  </h2>
                  <p>This is the way of the BugzillaSan.</p>
                </div>
              )}

              <div className="left-side__top-down">
                {!currentUser ? (
                  <>
                    <Link to="/register" className="button left-side__button">
                      Join the clan
                    </Link>
                    <Link to="/login" className="button left-side__button stroke">
                      Login
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}

          {/* ---- FAVORITE POSTS ---- */}
          {currentUser && (
            <div className="left-side__middle left-side__favorites">
              <h2>Favorite Posts</h2>

              {loadingFavs && <p className="loading">Loading...</p>}
              {errorFavs && <p className="error">{errorFavs}</p>}

              {!loadingFavs && !errorFavs && (
                <ul>
                  {favorites.length > 0 ? (
                    favorites.map((post) => (
                      <li key={post.id} className="favorite-post">
                        <Link to={`/posts/${post.id}`} className="favorite-post__title">
                          {post.title}
                        </Link>
                        <button className="favorite-post__remove" onClick={() => handleRemoveFavorite(post.id)} title="Remove from favorites">
                          ✕
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="empty">No favorite posts</p>
                  )}
                </ul>
              )}
            </div>
          )}

          {/* ---- CATEGORIES ---- */}
          <div className="left-side__down left-side__tags">
            <h2>Categories</h2>

            {loadingCats && <p className="loading">Loading...</p>}
            {errorCats && <p className="error">{errorCats}</p>}

            {!loadingCats && !errorCats && (
              <ul>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link to={`/categories/${cat.slug}`} className="category-link">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="empty">No categories found</p>
                )}
              </ul>
            )}
          </div>

          {!currentUser ? (
            <Link to={"/recovery"} className="button left-side__recovery">
              Recovery account
            </Link>
          ) : (
            <Link to={"/logout"} className="button left-side__recovery">
              Logout
            </Link>
          )}
        </div>
      </aside>

      {/* --- Confirm Modal --- */}
      <ConfirmModal isOpen={confirmModal.open} title="Remove from favorites?" message="Are you sure you want to remove this post from your favorites?" onConfirm={confirmRemove} onCancel={cancelRemove} />
    </>
  );
}
