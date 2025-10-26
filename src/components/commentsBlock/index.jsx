import { useEffect, useState, useRef } from "react";
import "./style.scss";
import CommentItem from "./commentItem";
import AlertModal from "../alertModal";

export default function CommentsBlock({ postId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyToName, setReplyToName] = useState(null);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
      setAlertModal({ open: true, message: "Failed to load comments" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          comment_id: replyTo || null,
        }),
      });

      if (!res.ok) throw new Error("Error adding comment");

      setNewComment("");
      setReplyTo(null);
      setReplyToName(null);
      await fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
      setAlertModal({ open: true, message: "Failed to add comment" });
    } finally {
      setLoading(false);
    }
  };

  const refreshComments = () => fetchComments();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleReply = (id, name) => {
    setReplyTo(id);
    setReplyToName(name);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      textareaRef.current?.focus();
    }, 150);
  };

  return (
    <div className="comments-block">
      <h3>Comments</h3>

      {loading && comments.length === 0 ? <p>Loading comments...</p> : comments.length === 0 ? <p>No comments yet</p> : comments.map((comment) => <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} onUpdated={refreshComments} onReply={handleReply} />)}

      {currentUserId ? (
        <form className="comments-block__form" onSubmit={handleAddComment} ref={formRef}>
          {replyTo && (
            <div className="reply-banner">
              Replying to <b>{replyToName || `#${replyTo}`}</b>
              <button
                type="button"
                className="cancel-reply"
                onClick={() => {
                  setReplyTo(null);
                  setReplyToName(null);
                }}
              >
                ✖ Cancel
              </button>
            </div>
          )}

          <textarea ref={textareaRef} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={replyTo ? "Write your reply..." : "Write a comment..."} rows={3} disabled={loading} />
          <button type="submit" disabled={loading || !newComment.trim()}>
            {replyTo ? "Reply" : "Add Comment"}
          </button>
        </form>
      ) : (
        <p className="comments-block__login-hint">Please log in to leave a comment.</p>
      )}

      <AlertModal isOpen={alertModal.open} message={alertModal.message} onClose={() => setAlertModal({ open: false, message: "" })} />
    </div>
  );
}
