import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostItem from "../../components/postItem";
import CommentsBlock from "../../components/commentsBlock";
import { API_URL } from "../../app/config.js";
import "./style.scss";

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const postRes = await fetch(`${API_URL}/posts/${id}`, {
          credentials: "include",
        });

        if (postRes.status === 404) {
          setPost(null);
          setError("not_found");
          return;
        }

        if (!postRes.ok) throw new Error("Failed to fetch post");
        const postData = await postRes.json();
        setPost(postData);

        const commentsRes = await fetch(`${API_URL}/posts/${id}/comments`, {
          credentials: "include",
        });
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (error === "not_found" || !post) {
    return (
      <div className="not-found" style={{ textAlign: "center" }}>
        <div className="not-found-content">
          <h2>Post Not Found</h2>
          <p>This post may have been deleted or never existed.</p>
          <button className="auth-btn button" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="auth-page" style={{ textAlign: "center" }}>
        <h2>Error Loading Post</h2>
        <p>{error}</p>
        <button className="auth-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );

  return (
    <div className="post-page">
      <PostItem {...post} compact={false} />
      <CommentsBlock postId={post.id} currentUserId={currentUser?.id} initialComments={comments} />
    </div>
  );
}
