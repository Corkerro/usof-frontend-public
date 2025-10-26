import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostItem from "../../components/postItem";
import { API_URL } from "../../app/config.js";
import "./style.scss";

export default function CategoryPage() {
  const { slug } = useParams();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("created_at"); // created_at | like_count | views
  const [order, setOrder] = useState("DESC"); // ASC | DESC

  // --- Fetch posts in category ---
  const fetchCategoryPosts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const url = `${API_URL}/categories/slug/${slug}/posts?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}&order=${order}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch category posts");

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setPosts((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === pageSize);
      setPage(reset ? 2 : currentPage + 1);
    } catch (err) {
      console.error(err);
      setError("Unable to load posts for this category.");
    } finally {
      setLoading(false);
    }
  };

  // --- Initial load and reset on sort/order change ---
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchCategoryPosts(true);
  }, [slug, sortBy, order]);

  return (
    <div className="category-page">
      <h1 className="category-page__title">Category: {slug}</h1>

      <div className="category-page__controls">
        <label>
          Sort by:{" "}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="views">Views</option>
            <option value="created_at">Date</option>
            <option value="like_count">Likes</option>
          </select>
        </label>

        <label>
          Order:{" "}
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {!loading && posts.length === 0 && !error && <p className="no-posts">No posts in this category yet.</p>}

      {posts.map((post) => (
        <PostItem key={post.id} {...post} compact={true} />
      ))}

      {/* Кнопка Load More всегда рендерится если hasMore === true */}
      {hasMore && !error && (
        <div className="load-more">
          <button onClick={() => fetchCategoryPosts()} disabled={loading} className="button">
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && <p>No more posts</p>}
    </div>
  );
}
