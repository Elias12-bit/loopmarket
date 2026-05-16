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

  useEffect(() => {
    if (user) {
      fetchMyAds();
    }
  }, []);

  const fetchMyAds = async () => {
    try {
      const res = await axios.get(`${API}/products/user/${user.id}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
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
    } catch (err) {
      console.error(err);
      alert("Could not delete this ad");
    }
  };

  // GUEST VIEW
  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>My Ads</h2>
        <p>You need to login to view your ads.</p>

        <button onClick={() => navigate("/login")}>Login</button>

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
    <div className="my-ads-container" style={{ padding: "20px" }}>
      <h2>My Ads</h2>

      <button
        onClick={() => navigate("/add-product")}
        style={{ marginBottom: "20px" }}
      >
        + Add New Product
      </button>

      {error && (
        <p style={{ color: "red" }}>Something went wrong loading your ads.</p>
      )}

      {products.length === 0 ? (
        <p>You have not added any ads yet.</p>
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
                {product.category_name || "Not specified"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {product.street && product.city && product.governorate
                  ? `${product.street}, ${product.city}, ${product.governorate}`
                  : "Not specified"}
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/product/${product.id}`)}>
                  View
                </button>

                <button onClick={() => navigate(`/update-product/${product.id}`)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(product.id)}>
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