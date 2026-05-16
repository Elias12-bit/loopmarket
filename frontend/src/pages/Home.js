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

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // GET PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // GET CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.title &&
      product.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      product.category_name === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="home-container" style={{ padding: "20px" }}>
      <h2>Loop Market</h2>

      {/* ADD PRODUCT BUTTON */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        {user ? (
          <button onClick={() => navigate("/add-product")}>
            + Add New Product
          </button>
        ) : (
          <button onClick={() => navigate("/login")}>
            Login to Add Product
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <div
        className="search-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "50%",
            padding: "10px",
            fontSize: "16px",
          }}
        />
      </div>

      {/* CATEGORIES */}
      <div
        className="categories-container"
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h3>Categories</h3>

        <div className="categories-list">
          <button
            onClick={() => setSelectedCategory("All")}
            style={{ margin: "5px" }}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              style={{ margin: "5px" }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        className="products-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
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
                image={product.image_url || "/images/default.jpg"}
                title={product.title}
                description={product.description}
                price={product.price}
              />

              <p>
                <strong>Category:</strong> {product.category_name}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {product.street && product.city && product.governorate
                  ? `${product.street}, ${product.city}, ${product.governorate}`
                  : "Not specified"}
              </p>

              <button onClick={() => navigate(`/product/${product.id}`)}>
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;