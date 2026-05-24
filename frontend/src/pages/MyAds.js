import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import API from "../api";

const MyAds = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyAds();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyAds = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/products/user/${user.id}`);
      setProducts(res.data);
      setError(false);
    } catch (err) {
      console.error("Fetch my ads error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ad?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: {
          userid: user.id,
        },
      });

      fetchMyAds();
      alert("Ad deleted successfully");
    } catch (err) {
      console.error("Delete ad error:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Could not delete this ad"
      );
    }
  };

  // GUEST VIEW
  if (!user) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>My Ads</h1>
          <p>You need to login or create an account to manage your ads.</p>

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
          <h2>Loading your ads...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="my-ads-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>My Ads</h1>

        <p>
          Manage your product listings, edit details, or delete ads you no
          longer need.
        </p>

        <div className="button-group">
          <button className="btn-primary" onClick={() => navigate("/add-product")}>
            + Add New Product
          </button>

          <button className="btn-dark" onClick={() => navigate("/profile")}>
            Back to Profile
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message" style={{ marginBottom: "25px" }}>
          Something went wrong loading your ads.
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
          <h3>Total Ads</h3>

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

        <div className="card">
          <h3>Status</h3>
          <p style={{ color: "#10b981", fontWeight: "800" }}>Active Seller</p>
        </div>
      </div>

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>You have not added any ads yet</h2>
          <p>Start selling by publishing your first product.</p>

          <button className="btn-primary" onClick={() => navigate("/add-product")}>
            + Add Your First Product
          </button>
        </div>
      ) : (
        <div className="my-ads-grid">
          {products.map((product) => (
            <div key={product.id} className="my-ad-card">
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
                  View
                </button>

                <button
                  className="btn-dark"
                  onClick={() => navigate(`/update-product/${product.id}`)}
                >
                  Edit
                </button>

                <button
                  className="btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAds;