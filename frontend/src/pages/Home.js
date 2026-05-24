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
      console.log("Fetch products error:", err);
    }
  };

  // GET CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log("Fetch categories error:", err);
    }
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const title = product.title || "";
    const category = product.category_name || product.name || "";

    const matchSearch = title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div>
          <h1>Buy and Sell Second-Hand Items Easily</h1>
          <p>
            Discover great deals near you. Sell products, chat with sellers, and
            find what you need on Loop Market.
          </p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for cars, phones, furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {user ? (
            <button onClick={() => navigate("/add-product")}>
              + Add Product
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>Login to Sell</button>
          )}
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card">
          <h3>{products.length}</h3>
          <p>Total Listings</p>
        </div>

        <div className="card">
          <h3>{categories.length}</h3>
          <p>Categories</p>
        </div>

        <div className="card">
          <h3>Secure</h3>
          <p>Chat before buying</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="admin-section">
        <h3>Browse Categories</h3>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            className={selectedCategory === "All" ? "btn-primary" : "btn-light"}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          {categories.map((cat) => {
            const categoryName = cat.name || cat.category_name;

            return (
              <button
                key={cat.id || cat.category_id}
                className={
                  selectedCategory === categoryName ? "btn-primary" : "btn-light"
                }
                onClick={() => setSelectedCategory(categoryName)}
              >
                {categoryName}
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h2>Latest Products</h2>
          <p style={{ color: "#6b7280", marginTop: "-10px" }}>
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {user ? (
          <button className="btn-primary" onClick={() => navigate("/add-product")}>
            + Add New Product
          </button>
        ) : (
          <button className="btn-dark" onClick={() => navigate("/login")}>
            Login to Add Product
          </button>
        )}
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try searching with another keyword or choose another category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <ProductCard
                image={product.image_url || "/images/default.jpg"}
                title={product.title}
                description={product.description}
                price={product.price}
              />

              <div style={{ marginTop: "15px" }}>
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
              </div>

              <div className="button-group">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;