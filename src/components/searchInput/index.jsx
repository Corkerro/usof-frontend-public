import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

export default function SearchInput({ placeholder = "Search posts..." }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const timeoutRef = useRef(null);

  // --- Debounced search ---
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!query || query.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/posts/search?page=1&pageSize=5&keyword=${encodeURIComponent(query)}`, { credentials: "include" });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  return (
    <div className="search-input-wrapper">
      <input type="text" className="search-input" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => query && setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />

      {showDropdown && (
        <ul className="search-dropdown">
          {loading && <li className="loading">Loading...</li>}
          {!loading && results.length === 0 && <li className="empty">No posts found</li>}
          {!loading &&
            results.map((post) => (
              <li key={post.id} className="search-dropdown-item">
                <Link to={`/posts/${post.id}`}>
                  <strong>{post.title}</strong>
                  <p className="snippet" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 60) + "..." }} />
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
