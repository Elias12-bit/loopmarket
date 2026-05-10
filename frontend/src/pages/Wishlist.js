import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import API from "../api";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user")).id; // ⚠️ replace later

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API}/wishlist/${userId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist`, {
        data: {
          user_id: userId,
          product_id: productId,
        },
      });

      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>My Wishlist ❤️</h2>

      {products.length === 0 ? (
        <p>No products in wishlist</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="product-card-wrapper">

            <ProductCard
              image={product.image || "/images/default.jpg"}
              title={product.title}
              description={product.description}
            />

            <p>${product.price}</p>

            <button onClick={() => removeFromWishlist(product.id)}>
              ❌ Remove
            </button>

          </div>
        ))
      )}

    </div>
  );
};

export default Wishlist;