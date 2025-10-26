import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "./style.scss";
import PostItem from "../../components/postItem";
import ConfirmModal from "../../components/сonfirmModal";
import AlertModal from "../../components/alertModal";

export default function ProfilePage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fullName, setFullName] = useState("");
  const [login, setLogin] = useState("");
  const [deleteToken, setDeleteToken] = useState("");
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const isOwn = currentUser?.id === Number(id);
  const fallbackAvatar = "https://cdn-icons-png.freepik.com/512/6596/6596121.png?user52";

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
  };

  const fetchUser = async () => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, { credentials: "include" });

      if (res.status === 404) {
        setError("not_found");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data);
      setFullName(data.fullName || "");
      setLogin(data.login || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts(true);
  }, [id]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = {};
      if (fullName.trim() && fullName !== user.fullName) payload.full_name = fullName;
      if (login.trim() && login !== user.login) payload.login = login;
      if (Object.keys(payload).length === 0) {
        showAlert("No changes to update");
        return;
      }

      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await fetchUser();
    } catch (err) {
      console.error(err);
      showAlert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("http://localhost:3000/api/users/avatar", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload avatar");
      await fetchUser();
    } catch (err) {
      console.error(err);
      showAlert("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDeleteAction = async () => {
    setIsConfirmOpen(false);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to request account deletion");
      const data = await res.json();
      showAlert(`Confirmation sent to your email.`);
      setDeleteToken(data.token || "");
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete account");
    }
  };

  const confirmDelete = async () => {
    if (!deleteToken) return showAlert("No token available");
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}/confirm-deletion`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: deleteToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm deletion");
      showAlert(data.message);
    } catch (err) {
      console.error(err);
      showAlert("Failed to confirm deletion");
    }
  };

  const handleRecovery = () => {
    navigate("/recovery");
  };

  const fetchPosts = async (reset = false) => {
    if (loadingPosts || (!hasMorePosts && !reset)) return;
    setLoadingPosts(true);
    try {
      const res = await fetch(`http://localhost:3000/api/posts/user/${id}?page=${reset ? 1 : page}&pageSize=${pageSize}&sortBy=${sortBy}&order=${order}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts((prev) => (reset ? data : [...prev, ...data]));
      setHasMorePosts(data.length === pageSize);
      setPage((prev) => (reset ? 2 : prev + 1));
    } catch (err) {
      console.error(err);
      showAlert("Failed to fetch posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [sortBy, order]);

  // --- USER NOT FOUND HANDLER ---
  if (error === "not_found") {
    return (
      <div className="not-found" style={{ textAlign: "center" }}>
        <div className="not-found-content">
          <h2>User Not Found</h2>
          {isOwn ? (
            <>
              <p>This is your profile, but it seems deleted.</p>
              <button className="button green" onClick={handleRecovery}>
                Recover Account
              </button>
            </>
          ) : (
            <>
              <p>The user may have been deleted or never existed.</p>
              {!currentUser && (
                <button className="button green" onClick={handleRecovery}>
                  Recover Account
                </button>
              )}

              <button className="button" onClick={() => navigate("/")}>
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!user) return <p>Loading user...</p>;

  const avatarUrl = user.avatarUrl ? `http://localhost:3000${user.avatarUrl}` : fallbackAvatar;

  return (
    <div className="profile-page">
      <h1>Profile: {user.login}</h1>

      <ConfirmModal isOpen={isConfirmOpen} title="Confirm Account Deletion" message="Are you sure you want to permanently delete your account? This action cannot be undone." onConfirm={confirmDeleteAction} onCancel={() => setIsConfirmOpen(false)} />

      {isOwn ? (
        <div className="profile-avatar-wrapper">
          <img src={avatarUrl} alt={user.login} className="profile-avatar clickable" onClick={() => fileInputRef.current?.click()} />
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>
      ) : (
        <img src={avatarUrl} alt={user.login} className="profile-avatar" />
      )}

      <p>Full Name: {user.fullName || "-"}</p>
      <p>Email: {user.email}</p>
      <p>Rating: {user.rating}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

      {isOwn && (
        <div className="profile-edit">
          <h2>Edit Profile</h2>
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" disabled={loading} />
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" disabled={loading} />
          <button className="button green" onClick={handleUpdate} disabled={loading}>
            Save Changes
          </button>

          <div className="delete-account">
            <button className="button red" onClick={handleDelete} disabled={loading}>
              Delete Account
            </button>
            {deleteToken && (
              <button className="button" onClick={confirmDelete}>
                Confirm Deletion
              </button>
            )}
          </div>
        </div>
      )}

      <div className="user-posts-section">
        <h2>{user.login}'s Posts</h2>

        <div className="posts-block__sort">
          <label>
            Sort by:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created_at">Date</option>
              <option value="like_count">Likes</option>
              <option value="views">Views</option>
            </select>
          </label>

          <label>
            Order:
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
        </div>

        {posts.length === 0 && !loadingPosts && <p>No posts yet</p>}

        {posts.map((post) => (
          <PostItem key={post.id} {...post} />
        ))}

        {hasMorePosts && (
          <div className="load-more">
            <button onClick={() => fetchPosts()} disabled={loadingPosts}>
              {loadingPosts ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {!hasMorePosts && posts.length > 0 && <p className="nomore">No more posts</p>}
      </div>

      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={() => setIsAlertOpen(false)} />
    </div>
  );
}
