import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRelativeTime } from "../../../app/getRelativeTime";
import like from "/like.svg";
import dislike from "/dislike.svg";
import trash from "/trash.svg";
import reply from "/reply.svg";
import "./style.scss";
import ConfirmModal from "../../сonfirmModal";

export default function CommentItem({ comment, currentUserId, onUpdated, onReply, level = 0 }) {
  const [likeCount, setLikeCount] = useState(Number(comment.likeCount));
  const [loading, setLoading] = useState(false);
  const [userLike, setUserLike] = useState(null);
  const [authorLogin, setAuthorLogin] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    setLikeCount(Number(comment.likeCount));
  }, [comment.likeCount]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${currentUserId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserRole(data.roleId);
        }
      } catch (err) {
        console.error("Error loading current user:", err);
      }
    };

    const fetchUserLike = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/comments/${comment.id}/like`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const found = data.find((x) => x.userId === currentUserId);
          if (found) setUserLike(found.type);
        }
      } catch (err) {
        console.error("Error fetching likes:", err);
      }
    };

    fetchUserData();
    fetchUserLike();
  }, [comment.id, currentUserId]);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${comment.authorId}`);
        if (res.ok) {
          const data = await res.json();
          setAuthorLogin(data.login);
        }
      } catch (err) {
        console.error("Error loading author:", err);
      }
    };
    fetchAuthor();
  }, [comment.authorId]);

  const dateObj = new Date(comment.createdAt);
  dateObj.setTime(dateObj.getTime() + 2 * 60 * 60 * 1000);
  const relativeTime = getRelativeTime(dateObj);
  const fullTime = dateObj.toLocaleString("en-GB");

  const isOwn = comment.authorId === currentUserId;
  const isAdmin = currentUserRole === 1; // ✅ роль 1 = админ
  const displayName = isOwn ? "You" : authorLogin || "Unknown";
  const hasLiked = userLike === "like";
  const hasDisliked = userLike === "dislike";
  const isReply = comment.parentId !== null;

  const handleVote = async (value) => {
    if (loading || !currentUserId) return;
    setLoading(true);
    try {
      const alreadyLiked = (value === 1 && hasLiked) || (value === -1 && hasDisliked);

      if (alreadyLiked) {
        await fetch(`http://localhost:3000/api/comments/${comment.id}/like`, {
          method: "DELETE",
          credentials: "include",
        });
        setUserLike(null);
        setLikeCount((prev) => prev - (value === 1 ? 1 : -1));
      } else {
        await fetch(`http://localhost:3000/api/comments/${comment.id}/like`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
        setUserLike(value === 1 ? "like" : "dislike");
        setLikeCount((prev) => prev + (value === 1 ? (hasDisliked ? 2 : 1) : hasLiked ? -2 : -1));
      }

      onUpdated?.();
    } catch (err) {
      console.error("Error while liking comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const url = isAdmin ? `http://localhost:3000/api/comments/${comment.id}/admin` : `http://localhost:3000/api/comments/${comment.id}`;
      await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      onUpdated?.();
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleReplyClick = () => {
    onReply?.(comment.id, displayName);
  };

  return (
    <>
      <div className={`comment-item ${hasLiked ? "liked" : hasDisliked ? "disliked" : ""} ${likeCount > 0 ? "good" : likeCount < 0 ? "bad" : ""} level-${level}`}>
        <div className="comment-item__header">
          <Link to={`/profile/${comment.authorId}`} className="comment-item__author">
            <strong>{displayName}</strong>
          </Link>
          <span className="comment-item__date" title={fullTime}>
            {relativeTime}
          </span>
        </div>

        <div className="comment-item__content">{comment.content}</div>

        <div className="comment-item__footer">
          {currentUserId && (
            <>
              <button disabled={loading} onClick={() => handleVote(1)} className={hasLiked ? "active" : ""}>
                <img src={like} alt="like" />
              </button>
              <button disabled={loading} onClick={() => handleVote(-1)} className={hasDisliked ? "disliked" : ""}>
                <img src={dislike} alt="dislike" />
              </button>
              {!isReply && (
                <button onClick={handleReplyClick} className="comment-item__reply">
                  <img src={reply} alt="reply" /> Reply
                </button>
              )}
            </>
          )}
          <span className="comment-item__rating">{likeCount} rating</span>

          {(isOwn || isAdmin) && (
            <button disabled={loading} onClick={() => setShowConfirm(true)} className="comment-item__delete" title={isAdmin ? "Delete as admin" : "Delete comment"}>
              <img src={trash} alt="trash" />
            </button>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-item__replies">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} currentUserId={currentUserId} onUpdated={onUpdated} onReply={onReply} level={level + 1} />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal isOpen={showConfirm} title="Delete comment" message="Are you sure you want to delete this comment?" onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
    </>
  );
}
