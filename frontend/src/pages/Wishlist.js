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

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API}/wishlist/${user.id}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist`, {
        data: {
          user_id: user.id,
          product_id: productId,
        },
      });

      fetchWishlist();
    } catch (err) {
      console.error(err);
      alert("Could not remove product from wishlist");
    }
  };

  // GUEST VIEW
  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Wishlist</h2>

        <p>You need to login to view your wishlist.</p>

        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          style={{ marginLeft: "10px" }}
        >
          Create New Account
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-container" style={{ padding: "20px" }}>
      <h2>My Wishlist ❤️</h2>

      {error && (
        <p style={{ color: "red" }}>
          Something went wrong loading your wishlist.
        </p>
      )}

      {products.length === 0 ? (
        <p>No products in wishlist.</p>
      ) : (
        <div
          className="products-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card-wrapper"
              style={{
                width: "260px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <ProductCard
                image={product.image_url || product.image || "/images/default.jpg"}
                title={product.title}
                description={product.description}
                price={product.price}
              />

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

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/product/${product.id}`)}>
                  View Details
                </button>

                <button onClick={() => removeFromWishlist(product.id)}>
                  ❌ Remove
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