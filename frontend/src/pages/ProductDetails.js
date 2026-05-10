import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}`);
      setProduct(res.data);

      // fetch seller info
      const userRes = await axios.get(
        `${API}/users/${res.data.user_id}`
      );
      setSeller(userRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.title}</h2>

      <img
        src={product.image_url || "/images/default.jpg"}
        alt={product.title}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <h3>${product.price}</h3>

      <p>{product.description}</p>

      {/* 📂 CATEGORY */}
      <p>Category: {product.category_name}</p>

      {/* 📍 LOCATION */}
      <p>
        Location: {product.street}, {product.city}, {product.governorate}
      </p>

      {/* 👤 SELLER */}
      {seller && (
        <div style={{ marginTop: "20px" }}>
          <h4>Seller Info</h4>

          <img
            src={seller.image || "/images/default-user.png"}
            alt="seller"
            style={{ width: "80px", borderRadius: "50%" }}
          />

          <p>{seller.name}</p>

          {/* ⭐ RATING PLACEHOLDER */}
          <p>⭐ Rating: (coming soon)</p>
        </div>
      )}

      {/* ❤️ WISHLIST */}
      <button
        onClick={async () => {
          try {
            await axios.post(`${API}/wishlist`, {
              user_id: user.id,
              product_id: product.id,
            });
            alert("Added to wishlist");
          } catch (err) {
            console.log(err);
          }
        }}
      >
        ❤️ Add to Wishlist
      </button>

      {/* 💬 CHAT */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() =>
            navigate("/chat", {
              state: { receiverId: product.user_id },
            })
          }
        >
          Chat with Seller
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;