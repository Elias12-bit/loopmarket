import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import API from "../api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔎 FILTERING
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" ||
      p.category_name === selectedCategory;

    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marketplace</h2>

      {/* 🔎 SEARCH */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", width: "50%" }}
        />
      </div>

      {/* 📂 CATEGORIES */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setSelectedCategory("All")}>All</button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            style={{ marginLeft: "10px" }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ➕ ADD PRODUCT */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={() => navigate("/add-product")}>
          Add New Product
        </button>
      </div>

      {/* 🛍️ PRODUCTS */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ margin: "10px" }}>
            <ProductCard
              image={product.image_url}
              title={product.title}
              description={product.description}
              price={product.price}
            />

            {/* 📍 LOCATION */}
            <p>
              📍 {product.street}, {product.city}, {product.governorate}
            </p>

            {/* 🔍 DETAILS */}
            <button
              onClick={() => navigate(`/product/${product.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;