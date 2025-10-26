import { useState, useEffect } from "react";
import PostItem from "../postItem";
import { API_URL } from "../../app/config.js";
import { useSelector } from "react-redux";
import "./style.scss";

export default function PostsBlock() {
  const currentUser = useSelector((state) => state.auth.user);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [sortBy, setSortBy] = useState("like_count"); // created_at | like_count | views
  const [order, setOrder] = useState("desc"); // asc | desc

  const fetchPosts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/posts?page=${reset ? 1 : page}&pageSize=${pageSize}&sortBy=${sortBy}&order=${order}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();

      setPosts((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === pageSize);
      setPage((prev) => (reset ? 2 : prev + 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true); // reload posts when sort changes
  }, [sortBy, order]);

  return (
    <div className="posts-block">
      <div className="posts-block__sort">
        <label>
          Sort by:{" "}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="created_at">Date</option>
            <option value="like_count">Likes</option>
            <option value="views">Views</option>
          </select>
        </label>

        <label>
          Order:{" "}
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {posts.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}

      {hasMore && (
        <div className="load-more">
          <button onClick={() => fetchPosts()} disabled={loading} className="button">
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && <p>No more posts</p>}
    </div>
  );
}
