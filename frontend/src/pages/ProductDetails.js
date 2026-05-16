import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}`);
      setProduct(res.data);

      if (res.data.user_id) {
        const sellerRes = await axios.get(`${API}/users/${res.data.user_id}`);
        setSeller(sellerRes.data);
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

    if (user.id === product.user_id) {
      alert("You cannot chat with yourself.");
      return;
    }

    navigate("/chat", {
      state: {
        receiverId: product.user_id,
      },
    });
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
          maxWidth: "400px",
        }}
      >
        <h3>Seller Info</h3>

        {seller ? (
          <>
            <img
              src={seller.image || seller.image_url || "/images/default-user.png"}
              alt="seller"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <p>
              <strong>Name:</strong> {seller.username || "Unknown seller"}
            </p>

            <p>
              <strong>Email:</strong> {seller.email || "Not available"}
            </p>

            <p>
              <strong>Phone:</strong> {seller.phone || "Not available"}
            </p>

            <p>
              <strong>Rating:</strong> ⭐⭐⭐⭐⭐
            </p>
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