import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [ratingInfo, setRatingInfo] = useState({
    average_rating: 0,
    total_reviews: 0,
  });

  const [selectedRating, setSelectedRating] = useState(0);
  const [error, setError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const productRes = await axios.get(`${API}/products/${id}`);
      setProduct(productRes.data);

      if (productRes.data.user_id) {
        try {
          const sellerRes = await axios.get(
            `${API}/users/${productRes.data.user_id}`
          );
          setSeller(sellerRes.data);

          const ratingRes = await axios.get(
            `${API}/reviews/seller/${productRes.data.user_id}`
          );
          setRatingInfo(ratingRes.data);
        } catch (sellerErr) {
          console.error("Seller/rating info error:", sellerErr);
          setSeller(null);
        }
      }
    } catch (err) {
      console.error("Product details error:", err);
      setError(true);
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${API}/wishlist`, {
        user_id: user.id,
        product_id: product.id,
      });

      alert("Product added to wishlist ❤️");
    } catch (err) {
      console.error(err);
      alert("This product may already be in your wishlist");
    }
  };

  const chatWithSeller = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product.user_id) {
      alert("Seller not available for this product.");
      return;
    }

    if (Number(user.id) === Number(product.user_id)) {
      alert("You cannot chat with yourself.");
      return;
    }

    navigate(`/chat?sellerId=${product.user_id}`);
  };

  const submitRating = async (ratingValue) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product.user_id) {
      alert("Seller not available.");
      return;
    }

    if (Number(user.id) === Number(product.user_id)) {
      alert("You cannot rate yourself.");
      return;
    }

    try {
      setSelectedRating(ratingValue);

      await axios.post(`${API}/reviews`, {
        reviewer_id: user.id,
        seller_id: product.user_id,
        product_id: product.id,
        rating: ratingValue,
      });

      alert("Rating submitted successfully ⭐");

      const ratingRes = await axios.get(
        `${API}/reviews/seller/${product.user_id}`
      );
      setRatingInfo(ratingRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  };

  const renderAverageStars = () => {
    const avg = Number(ratingInfo.average_rating || 0);
    const rounded = Math.round(avg);

    if (rounded === 0) {
      return "☆☆☆☆☆";
    }

    return "⭐".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  if (error) {
    return (
      <div className="product-details-container">
        <div className="error-message">
          <h2>Failed to load product details</h2>
          <p>Please try again later.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="empty-state">
          <h2>Loading product...</h2>
        </div>
      </div>
    );
  }

  const isOwner = user && Number(user.id) === Number(product.user_id);

  return (
    <div className="product-details-container">
      {/* BACK BUTTON */}
      <button className="btn-light" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* MAIN PRODUCT CARD */}
      <div className="product-details-card" style={{ marginTop: "25px" }}>
        {/* LEFT IMAGE */}
        <div>
          <img
            src={product.image_url || product.image || "/images/default.jpg"}
            alt={product.title}
          />
        </div>

        {/* RIGHT PRODUCT INFO */}
        <div>
          <p
            style={{
              color: "#f59e0b",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            Product Details
          </p>

          <h1>{product.title}</h1>

          <h2
            style={{
              color: "#f59e0b",
              marginBottom: "20px",
            }}
          >
            ${product.price}
          </h2>

          <p>
            <strong>Description:</strong>
          </p>

          <p style={{ color: "#4b5563" }}>
            {product.description || "No description added for this product."}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <div className="card">
              <h3>Category</h3>
              <p>{product.category_name || product.category || "Not specified"}</p>
            </div>

            <div className="card">
              <h3>Location</h3>
              <p>
                {product.street && product.city && product.governorate
                  ? `${product.street}, ${product.city}, ${product.governorate}`
                  : product.location || "Not specified"}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="button-group" style={{ marginTop: "25px" }}>
            {user ? (
              <>
                <button className="btn-primary" onClick={addToWishlist}>
                  ❤️ Add to Wishlist
                </button>

                <button className="btn-dark" onClick={chatWithSeller}>
                  💬 Chat with Seller
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Login to Add Wishlist
                </button>

                <button className="btn-dark" onClick={() => navigate("/login")}>
                  Login to Chat
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SELLER SECTION */}
      <div className="seller-box" style={{ marginTop: "30px" }}>
        <h2>Seller Information</h2>

        {seller ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: "25px",
              alignItems: "center",
            }}
          >
            {/* SELLER IMAGE */}
            <div style={{ textAlign: "center" }}>
              <img
                src={seller.image_url || "/images/default-user.png"}
                alt="seller"
                style={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "5px solid #f59e0b",
                  background: "#e5e7eb",
                }}
              />
            </div>

            {/* SELLER INFO */}
            <div>
              <h3>{seller.username || seller.name || "Unknown seller"}</h3>

              <p>
                <strong>Email:</strong> {seller.email || "Not available"}
              </p>

              <p>
                <strong>Phone:</strong> {seller.phone || "Not available"}
              </p>

              <p>
                <strong>Address:</strong> {seller.address || "Not available"}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: "15px",
                  marginTop: "20px",
                }}
              >
                <div className="card">
                  <h3>Average Rating</h3>
                  <p className="stars">{renderAverageStars()}</p>
                  <p>
                    {Number(ratingInfo.average_rating || 0).toFixed(1)} / 5
                  </p>
                </div>

                <div className="card">
                  <h3>Total Reviews</h3>
                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#111827",
                    }}
                  >
                    {ratingInfo.total_reviews || 0}
                  </p>
                </div>
              </div>

              {/* RATE SELLER */}
              <div style={{ marginTop: "25px" }}>
                <h3>Rate this seller</h3>

                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => submitRating(star)}
                      style={{
                        cursor:
                          user && !isOwner ? "pointer" : "not-allowed",
                        fontSize: "34px",
                        color: star <= selectedRating ? "#f59e0b" : "#d1d5db",
                        marginRight: "6px",
                        transition: "0.2s ease",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {!user && (
                  <p style={{ color: "#dc2626", fontWeight: "700" }}>
                    Login to rate this seller.
                  </p>
                )}

                {isOwner && (
                  <p style={{ color: "#dc2626", fontWeight: "700" }}>
                    You cannot rate yourself.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h3>Seller info not available</h3>
            <p>This product does not have seller information yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;