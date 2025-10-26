import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRelativeTime } from "../../app/getRelativeTime";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import like from "/like.svg";
import dislike from "/dislike.svg";
import trash from "/trash.svg";

import "./style.scss";

import { addFavorite, removeFavorite, fetchFavorites } from "../../app/store/favoritesSlice";
import ConfirmModal from "../сonfirmModal";
import AlertModal from "../alertModal";

export default function PostItem({ id, title, content, categories = [], authorId: initialAuthorId, views = 0, createdAt, likeCount: initialLikeCount = 0, compact = true, onUpdated }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [likeCount, setLikeCount] = useState(Number(initialLikeCount) || 0);
  const [userLike, setUserLike] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState(null);

  const [authorId, setAuthorId] = useState(initialAuthorId || null);
  const [authorLogin, setAuthorLogin] = useState(null);
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [postData, setPostData] = useState({ title, content, categories });
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editCategoryIds, setEditCategoryIds] = useState(categories.map((c) => c.id));
  const [allCategories, setAllCategories] = useState([]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  const [confirmModal, setConfirmModal] = useState({ open: false, postId: null });
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  const isOwn = authorId && currentUserId && authorId === currentUserId;
  const isAdmin = currentUser?.roleId === 1;

  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true);
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setAuthorId(data.authorId);
        const fixedContent = data.content.replace(/src="(\/[^"]+)"/g, 'src="http://localhost:3000$1"');
        setPostData(data);
        setEditTitle(data.title);
        setEditContent(fixedContent);
        setEditCategoryIds(data.categories.map((c) => c.id));
        setLikeCount(Number(data.likeCount) || 0);
      } catch {
        setError("Post not available");
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchUserLike = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${id}/like`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const found = data.find((x) => x.userId === currentUserId);
        setUserLike(found ? (found.type === "like" ? 1 : -1) : 0);
      } catch {}
    };
    fetchUserLike();
  }, [id, currentUserId]);

  useEffect(() => {
    if (!authorId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${authorId}`);
        if (!res.ok) return;
        const data = await res.json();
        setAuthorLogin(data.login || "Unknown");
        setAuthorAvatarUrl(data.avatarUrl ? `http://localhost:3000${data.avatarUrl}` : null);
      } catch {}
    })();
  }, [authorId]);

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories?page=1&pageSize=50&sort=desc", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setAllCategories(data);
      } catch {}
    })();
  }, [isEditing]);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchFav = async () => {
      try {
        await dispatch(fetchFavorites());
        const state = await store.getState();
        setIsFavorite(state.favorites.items.some((p) => p.id === id));
      } catch {
      } finally {
        setLoadingFavorite(false);
      }
    };
    fetchFav();
  }, [id, currentUserId, dispatch]);

  const handleLike = async (value) => {
    if (!currentUserId) return setAlertModal({ open: true, message: "Login to react on posts" });
    if (loading) return;
    setLoading(true);
    try {
      if (value === userLike) {
        const res = await fetch(`http://localhost:3000/api/posts/${id}/like`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to remove like/dislike");
        setUserLike(0);
        setLikeCount((prev) => prev - value);
        return;
      }
      const res = await fetch(`http://localhost:3000/api/posts/${id}/like`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error("Failed to react");
      setLikeCount((prev) => prev + (value - userLike));
      setUserLike(value);
    } catch {
      setAlertModal({ open: true, message: "Failed to update like" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = () => setConfirmModal({ open: true, postId: id });

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const endpoint = isOwn ? `http://localhost:3000/api/posts/${confirmModal.postId}` : `http://localhost:3000/api/posts/${confirmModal.postId}/admin`;

      const res = await fetch(endpoint, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setAlertModal({ open: true, message: "Post deleted successfully" });
      setConfirmModal({ open: false, postId: null });
      onUpdated?.();
    } catch {
      setAlertModal({ open: true, message: "Error deleting post" });
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => setConfirmModal({ open: false, postId: null });

  const handleToggleFavorite = async () => {
    if (!currentUserId) return setAlertModal({ open: true, message: "Login to manage favorites" });
    setLoading(true);
    try {
      if (isFavorite) {
        await dispatch(removeFavorite(id));
        setIsFavorite(false);
      } else {
        await dispatch(addFavorite(id));
        setIsFavorite(true);
      }
      dispatch(fetchFavorites());
    } catch {
      setAlertModal({ open: true, message: "Failed to update favorites" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      editCategoryIds.forEach((id) => formData.append("categoryIds[]", id));
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPostData(updated);
      setEditContent(updated.content.replace(/src="(\/[^"]+)"/g, 'src="http://localhost:3000$1"'));
      setEditTitle(updated.title);
      setIsEditing(false);
      onUpdated?.();
    } catch {
      setAlertModal({ open: true, message: "Error saving post" });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id) => setEditCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const formatContent = (html) => {
    if (!html) return "";
    if (compact) {
      let formatted = html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<img[^>]*>/gi, "[image]")
        .replace(/<\/p>/gi, " ")
        .replace(/<\/h[1-6]>/gi, " ")
        .replace(/<\/ol>/gi, " ")
        .replace(/<\/ul>/gi, " ")
        .replace(/<\/blockquote>/gi, " ")
        .replace(/<[^>]+>/gi, "");
      return formatted;
    }
    return html.replace(/src="(\/[^"]+)"/g, 'src="http://localhost:3000$1"');
  };

  if (loadingPost) return <p>Loading post...</p>;
  if (error) return <p className="error">{error}</p>;

  const dateObj = new Date(createdAt);
  const relativeTime = getRelativeTime(dateObj);
  const fullTime = dateObj.toLocaleString("en-GB");

  const quillModules = {
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["blockquote", "code-block"], ["link"], ["clean"]],
  };

  const ratingClass = likeCount > 0 ? "good" : likeCount < 0 ? "bad" : "";
  const reactionClass = userLike === 1 ? "liked" : userLike === -1 ? "disliked" : "";

  if (isEditing) {
    return (
      <div className="post-item-edit">
        <form onSubmit={handleEditSubmit}>
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} disabled={loading} className="input" />
          <ReactQuill ref={quillRef} value={editContent} onChange={setEditContent} theme="snow" modules={quillModules} className="editor" />
          <div className="categories">
            {allCategories.map((cat) => (
              <label key={cat.id}>
                <input type="checkbox" checked={editCategoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                {cat.name}
              </label>
            ))}
          </div>
          <button className="button green" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="button" type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className={`post-item ${compact ? "compact" : "full"} ${ratingClass} ${reactionClass}`}>
        {!compact && isOwn && (
          <div className="post-item__edit-btn">
            <button className="button header__right-button stroke" onClick={() => setIsEditing(true)}>
              Edit Post
            </button>
          </div>
        )}
        <ul className="post-item__top">
          <li className="rating">{likeCount} rating</li>
          <li>{views} views</li>
        </ul>
        <div className="post-item__header">
          {currentUserId && !isOwn && !loadingFavorite && !compact && (
            <button className={`favorite-btn button ${isFavorite ? "stroke" : ""}`} onClick={handleToggleFavorite} disabled={loading}>
              {isFavorite ? "Remove Favorite" : "Add to Favorite"}
            </button>
          )}
          <h2 className="post-item__title">
            <Link to={`/posts/${id}`}>{postData.title}</Link>
          </h2>
        </div>
        <div className="post-item__content">
          <div dangerouslySetInnerHTML={{ __html: formatContent(postData.content) }} />
        </div>
        {!compact && (
          <div className="post-item__actions">
            <button className={`rating-btn like-btn ${userLike === 1 ? "active" : ""}`} onClick={() => handleLike(1)} disabled={loading}>
              <img src={like} alt="like" />
            </button>
            <button className={`rating-btn dislike-btn ${userLike === -1 ? "active" : ""}`} onClick={() => handleLike(-1)} disabled={loading}>
              <img src={dislike} alt="dislike" />
            </button>
            {(isOwn || isAdmin) && (
              <button onClick={handleDeletePost} disabled={loading}>
                <img src={trash} alt="trash" />
              </button>
            )}
          </div>
        )}
        <div className="post-item__footer">
          <div className="post-item__meta">
            <img src={authorAvatarUrl || `https://cdn-icons-png.freepik.com/512/6596/6596121.png?${authorLogin}`} alt={authorLogin || "User"} className="post-item__meta-ava clickable" onClick={() => navigate(`/profile/${authorId}`)} />
            <div className="post-item__meta-info">
              <span className="post-item__author clickable" onClick={() => navigate(`/profile/${authorId}`)}>
                {authorLogin || "Unknown"}
              </span>
              <span className="post-item__date" title={fullTime}>
                {relativeTime}
              </span>
            </div>
          </div>
          <div className="post-item__tags">
            {postData.categories.map((category, i) => (
              <Link to={`/categories/${category.slug}`} key={i} className="post-item__tag">
                #{category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={confirmModal.open} title="Delete this post?" message="Are you sure you want to permanently delete this post?" onConfirm={confirmDelete} onCancel={cancelDelete} />

      <AlertModal isOpen={alertModal.open} message={alertModal.message} onClose={() => setAlertModal({ open: false, message: "" })} />
    </>
  );
}
