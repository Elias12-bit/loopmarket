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
      return "No ratings yet";
    }

    return "⭐".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>Failed to load product details.</p>
        <button onClick={() => navigate("/")}>Back Home</button>
      </div>
    );
  }

  if (!product) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div className="product-details-container" style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      {/* PRODUCT DETAILS */}
      <div style={{ marginTop: "20px" }}>
        <h2>{product.title}</h2>

        <img
          src={product.image_url || product.image || "/images/default.jpg"}
          alt={product.title}
          style={{
            width: "350px",
            maxWidth: "100%",
            height: "250px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />

        <h3>${product.price}</h3>

        <p>
          <strong>Description:</strong> {product.description}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {product.category_name || product.category || "Not specified"}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {product.street && product.city && product.governorate
            ? `${product.street}, ${product.city}, ${product.governorate}`
            : product.location || "Not specified"}
        </p>
      </div>

      {/* SELLER INFO */}
      <div
        className="seller-info"
        style={{
          marginTop: "30px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "450px",
        }}
      >
        <h3>Seller Info</h3>

        {seller ? (
          <>
            <img
              src={seller.image_url || "/images/default-user.png"}
              alt="seller"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <p>
              <strong>Name:</strong>{" "}
              {seller.username || seller.name || "Unknown seller"}
            </p>

            <p>
              <strong>Email:</strong> {seller.email || "Not available"}
            </p>

            <p>
              <strong>Phone:</strong> {seller.phone || "Not available"}
            </p>

            <p>
              <strong>Average Rating:</strong> {renderAverageStars()}
            </p>

            <p>
              <strong>Rating Number:</strong>{" "}
              {Number(ratingInfo.average_rating || 0).toFixed(1)} / 5
            </p>

            <p>
              <strong>Total Reviews:</strong> {ratingInfo.total_reviews || 0}
            </p>

            {/* RATE SELLER */}
            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>Rate this seller:</strong>
              </p>

              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => submitRating(star)}
                  style={{
                    cursor:
                      user && Number(user.id) !== Number(product.user_id)
                        ? "pointer"
                        : "not-allowed",
                    fontSize: "30px",
                    color: star <= selectedRating ? "gold" : "gray",
                    marginRight: "5px",
                  }}
                >
                  ★
                </span>
              ))}

              {!user && (
                <p style={{ color: "red" }}>
                  Login to rate this seller.
                </p>
              )}

              {user && Number(user.id) === Number(product.user_id) && (
                <p style={{ color: "red" }}>
                  You cannot rate yourself.
                </p>
              )}
            </div>
          </>
        ) : (
          <p>Seller info not available</p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div
        style={{
          marginTop: "25px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {user ? (
          <>
            <button onClick={addToWishlist}>❤️ Add to Wishlist</button>
            <button onClick={chatWithSeller}>💬 Chat with Seller</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>
              Login to Add to Wishlist
            </button>

            <button onClick={() => navigate("/login")}>
              Login to Chat with Seller
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;