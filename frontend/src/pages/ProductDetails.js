import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);

  const [productImages, setProductImages] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myRating, setMyRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchProductImages();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/products/${id}`);

      setProduct(res.data);

      if (res.data.image_url) {
        setMainImage(res.data.image_url);
      }

      if (res.data.user_id) {
        fetchSeller(res.data.user_id);
        fetchSellerRating(res.data.user_id);
      }
    } catch (err) {
      console.error("Fetch product error:", err.response?.data || err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}/images`);

      setProductImages(res.data);

      if (res.data.length > 0) {
        setMainImage(res.data[0].image_url);
      }
    } catch (err) {
      console.error("Fetch product images error:", err.response?.data || err);
    }
  };

  const fetchSeller = async (sellerId) => {
    try {
      const res = await axios.get(`${API}/users/${sellerId}`);
      setSeller(res.data);
    } catch (err) {
      console.error("Fetch seller error:", err.response?.data || err);
    }
  };

  const fetchSellerRating = async (sellerId) => {
    try {
      const res = await axios.get(`${API}/reviews/seller/${sellerId}`);

      setAverageRating(res.data.average_rating || 0);
      setTotalReviews(res.data.total_reviews || 0);
    } catch (err) {
      console.error("Fetch rating error:", err.response?.data || err);
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${API}/wishlist`, {
        user_id: user.id,
        product_id: id,
      });

      alert("Product added to wishlist");
    } catch (err) {
      console.error("Wishlist error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add to wishlist"
      );
    }
  };

  const startChat = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!product?.user_id) {
      alert("Seller not found");
      return;
    }

    if (Number(user.id) === Number(product.user_id)) {
      alert("This is your own product");
      return;
    }

    navigate(`/chat?sellerId=${product.user_id}`);
  };

  const submitRating = async (rating) => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!product?.user_id) {
      alert("Seller not found");
      return;
    }

    if (Number(user.id) === Number(product.user_id)) {
      alert("You cannot rate yourself");
      return;
    }

    try {
      setMyRating(rating);

      await axios.post(`${API}/reviews`, {
        reviewer_id: user.id,
        seller_id: product.user_id,
        product_id: product.id,
        rating,
      });

      alert("Rating submitted successfully");
      fetchSellerRating(product.user_id);
    } catch (err) {
      console.error("Rating error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to submit rating"
      );
    }
  };

  if (loading) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>Loading product...</h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>Product Not Found</h1>
          <p>{error || "This product does not exist."}</p>

          <button className="btn-primary" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && Number(user.id) === Number(product.user_id);

  return (
    <div className="my-ads-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>{product.title}</h1>
        <p>
          {product.category_name || "Product"}{" "}
          {product.city ? `in ${product.city}` : ""}
        </p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/")}>
            Back to Home
          </button>

          {isOwner && (
            <button
              className="btn-primary"
              onClick={() => navigate(`/update-product/${product.id}`)}
            >
              Edit Product
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div
        className="product-details-card"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "30px",
          alignItems: "start",
        }}
      >
        {/* LEFT SIDE: IMAGES */}
        <div>
          <img
            src={mainImage || product.image_url || "/images/default.jpg"}
            alt={product.title}
            style={{
              width: "100%",
              height: "430px",
              objectFit: "cover",
              borderRadius: "18px",
              background: "#e5e7eb",
              marginBottom: "15px",
            }}
          />

          {productImages.length > 1 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
              }}
            >
              {productImages.map((img) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt="product"
                  onClick={() => setMainImage(img.image_url)}
                  style={{
                    width: "100%",
                    height: "85px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    cursor: "pointer",
                    border:
                      mainImage === img.image_url
                        ? "3px solid #f59e0b"
                        : "2px solid #e5e7eb",
                  }}
                />
              ))}
            </div>
          )}

          {productImages.length === 1 && (
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              1 photo uploaded
            </p>
          )}

          {productImages.length > 1 && (
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              {productImages.length} photos uploaded
            </p>
          )}
        </div>

        {/* RIGHT SIDE: DETAILS */}
        <div>
          <h2>{product.title}</h2>

          <p className="price" style={{ fontSize: "28px" }}>
            ${product.price}
          </p>

          <p style={{ color: "#374151", lineHeight: "1.7" }}>
            {product.description}
          </p>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Product Info</h3>

            <p>
              <strong>Category:</strong>{" "}
              {product.category_name || "Not available"}
            </p>

            <p>
              <strong>City:</strong> {product.city || "Not available"}
            </p>

            <p>
              <strong>Governorate:</strong>{" "}
              {product.governorate || "Not available"}
            </p>

            <p>
              <strong>Street:</strong> {product.street || "Not available"}
            </p>

            <p>
              <strong>Building:</strong>{" "}
              {product.building || "Not available"}
            </p>
          </div>

          <div className="button-group" style={{ marginTop: "20px" }}>
            {!isOwner && (
              <>
                <button className="btn-primary" onClick={addToWishlist}>
                  Add to Wishlist
                </button>

                <button className="btn-dark" onClick={startChat}>
                  Chat with Seller
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SELLER */}
      <div className="seller-box" style={{ marginTop: "30px" }}>
        <h2>Seller Information</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <img
            src={seller?.image_url || "/images/default-user.png"}
            alt="seller"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              background: "#e5e7eb",
            }}
          />

          <div>
            <h3>{seller?.username || "Seller"}</h3>

            <p>
              <strong>Email:</strong> {seller?.email || "Not available"}
            </p>

            <p>
              <strong>Phone:</strong> {seller?.phone || "Not available"}
            </p>

            <p>
              <strong>Address:</strong> {seller?.address || "Not available"}
            </p>

            <p>
              <strong>Rating:</strong> ⭐ {averageRating || 0} / 5{" "}
              <span style={{ color: "#6b7280" }}>
                ({totalReviews || 0} reviews)
              </span>
            </p>
          </div>
        </div>

        {!isOwner && (
          <div style={{ marginTop: "20px" }}>
            <h3>Rate this Seller</h3>

            <div style={{ display: "flex", gap: "8px", fontSize: "28px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => submitRating(star)}
                  style={{
                    cursor: "pointer",
                    color: star <= myRating ? "#f59e0b" : "#d1d5db",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;