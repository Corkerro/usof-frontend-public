import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./style.scss";
import AlertModal from "../../components/alertModal";

export default function CreatePost() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const quillRef = useRef(null);

  const isAdmin = currentUser?.roleId === 1;

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories?page=1&pageSize=50&sort=desc", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!isAdmin) {
      setAlertModal({ open: true, message: "Only administrators can create categories." });
      return;
    }

    const name = newCategoryName.trim();
    if (!name) return;

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description: name }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      const data = await res.json();
      setCategories((prev) => [...prev, data]);
      setCategoryIds((prev) => [...prev, data.id]);
      setNewCategoryName("");
    } catch (err) {
      console.error(err);
      setAlertModal({ open: true, message: "Error creating category" });
    }
  };

  const toggleCategory = (id) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleImageInsert = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setImagePreviews((prev) => [...prev, { base64, file }]);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", base64);
        quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  };

  const quillModules = {
    toolbar: {
      container: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["blockquote", "code-block"], ["link", "image"], ["clean"]],
      handlers: {
        image: handleImageInsert,
      },
    },
  };

  const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "blockquote", "code-block", "link", "image"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || categoryIds.length === 0) {
      setAlertModal({
        open: true,
        message: "Please enter title, content, and select at least one category!",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);

      let contentToSend = content;
      imagePreviews.forEach(({ base64 }) => {
        contentToSend = contentToSend.replace(base64, "temp");
      });
      formData.append("content", contentToSend);
      formData.append("categoryIds", JSON.stringify(categoryIds));
      imagePreviews.forEach(({ file }) => formData.append("images", file));

      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        setAlertModal({
          open: true,
          message: "Failed to create post: " + (errData.error || "Unknown error"),
        });
        return;
      }

      const data = await res.json();
      navigate(`/posts/${data.id}`);
    } catch (err) {
      console.error(err);
      setAlertModal({ open: true, message: "Error submitting post" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h1 className="title">Create New Post</h1>

      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} className="input" />

        <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={quillModules} formats={quillFormats} placeholder="Write something interesting..." className="editor" />

        <div className="categories">
          {categories.map((cat) => (
            <label key={cat.id} className="category-label">
              <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>

        {isAdmin && (
          <div className="new-category">
            <input type="text" placeholder="Create new category" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} disabled={loading} className="input-small" />
            <button type="button" onClick={handleAddCategory} disabled={loading} className="btn-add">
              Add
            </button>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>

      <AlertModal isOpen={alertModal.open} message={alertModal.message} onClose={() => setAlertModal({ open: false, message: "" })} />
    </div>
  );
}
