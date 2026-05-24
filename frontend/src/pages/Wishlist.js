import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import API from "../api";

const Wishlist = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/wishlist/${user.id}`);
      setProducts(res.data);
      setError(false);
    } catch (err) {
      console.error("Wishlist error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    const confirmRemove = window.confirm(
      "Remove this product from your wishlist?"
    );

    if (!confirmRemove) return;

    try {
      await axios.delete(`${API}/wishlist`, {
        data: {
          user_id: user.id,
          product_id: productId,
        },
      });

      fetchWishlist();
    } catch (err) {
      console.error("Remove wishlist error:", err);
      alert("Could not remove product from wishlist");
    }
  };

  // GUEST VIEW
  if (!user) {
    return (
      <div className="wishlist-container">
        <div className="empty-state">
          <h1>My Wishlist</h1>
          <p>You need to login or create an account to view your wishlist.</p>

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
      <div className="wishlist-container">
        <div className="empty-state">
          <h2>Loading wishlist...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>My Wishlist ❤️</h1>
        <p>
          Save your favorite products here and come back to them anytime.
        </p>

        <div className="button-group">
          <button className="btn-primary" onClick={() => navigate("/")}>
            Browse Products
          </button>

          <button className="btn-dark" onClick={() => navigate("/profile")}>
            Back to Profile
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message" style={{ marginBottom: "25px" }}>
          Something went wrong loading your wishlist.
        </div>
      )}

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card">
          <h3>Saved Products</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#f59e0b",
            }}
          >
            {products.length}
          </p>
        </div>

        <div className="card">
          <h3>Account</h3>
          <p>{user.username || "User"}</p>
        </div>
      </div>

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products in your wishlist</h2>
          <p>Start browsing products and save the ones you like.</p>

          <button className="btn-primary" onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div key={product.id} className="wishlist-card">
              <ProductCard
                image={
                  product.image_url ||
                  product.image ||
                  "/images/default.jpg"
                }
                title={product.title}
                description={product.description}
                price={product.price}
              />

              <div style={{ marginTop: "15px" }}>
                <p>
                  <strong>Category:</strong>{" "}
                  {product.category_name ||
                    product.category ||
                    "Not specified"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {product.street && product.city && product.governorate
                    ? `${product.street}, ${product.city}, ${product.governorate}`
                    : product.location || "Not specified"}
                </p>
              </div>

              <div className="button-group">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </button>

                <button
                  className="btn-danger"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;