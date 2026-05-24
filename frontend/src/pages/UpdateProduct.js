import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/products/${id}`);

      setTitle(res.data.title || "");
      setDescription(res.data.description || "");
      setPrice(res.data.price || "");
      setImageUrl(res.data.image_url || res.data.image || "");

      const fullLocation =
        res.data.street && res.data.city && res.data.governorate
          ? `${res.data.street}, ${res.data.city}, ${res.data.governorate}`
          : res.data.location || "";

      setLocation(fullLocation);
    } catch (err) {
      console.error("Fetch product error:", err.response?.data || err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !price) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await axios.put(
        `${API}/products/${id}`,
        {
          title,
          description,
          price,
          image_url: imageUrl,
          location,
        },
        {
          headers: {
            userid: user?.id,
          },
        }
      );

      alert("Product updated successfully");
      navigate("/my-ads");
    } catch (err) {
      console.error("Update product error:", err.response?.data || err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong updating product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>Update Product</h1>
          <p>You need to login to update a product.</p>

          <div className="button-group" style={{ justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>

            <button className="btn-dark" onClick={() => navigate("/signup")}>
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h2>Loading product...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="my-ads-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>Update Product</h1>
        <p>Edit your product information and keep your listing updated.</p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/my-ads")}>
            Back to My Ads
          </button>

          <button className="btn-light" onClick={() => navigate(`/product/${id}`)}>
            View Product
          </button>
        </div>
      </div>

      {/* FORM + PREVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "25px",
          alignItems: "start",
        }}
      >
        <form onSubmit={handleSubmit}>
          <h2>Product Information</h2>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "18px",
                fontWeight: "700",
              }}
            >
              {error}
            </div>
          )}

          <label>Product Title</label>
          <input
            type="text"
            placeholder="Enter product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Update product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Price</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Location</label>
          <input
            type="text"
            placeholder="Example: Tripoli, Lebanon"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Image URL</label>
          <input
            type="text"
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="button-group">
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Updating Product..." : "Update Product"}
            </button>

            <button
              className="btn-light"
              type="button"
              onClick={() => navigate("/my-ads")}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* PREVIEW CARD */}
        <div className="card">
          <h2>Preview</h2>

          <img
            src={imageUrl || "/images/default.jpg"}
            alt="preview"
            style={{
              width: "100%",
              height: "230px",
              objectFit: "cover",
              borderRadius: "16px",
              background: "#e5e7eb",
              marginBottom: "15px",
            }}
          />

          <h3>{title || "Product title"}</h3>

          <p className="price">${price || "0"}</p>

          <p style={{ color: "#6b7280" }}>
            {description || "Product description will appear here."}
          </p>

          <p>
            <strong>Location:</strong> {location || "Not added"}
          </p>

          <p>
            <strong>Seller:</strong> {user.username || "User"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;