import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err.response?.data || err);
    }
  };

  const handleAllCategories = () => {
    setSelectedCategory("");
    fetchProducts();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    navigate(`/category/${category.id}`);
  };

  const filteredProducts = products.filter((product) => {
    const title = product.title ? product.title.toLowerCase() : "";
    const description = product.description
      ? product.description.toLowerCase()
      : "";
    const city = product.city ? product.city.toLowerCase() : "";
    const category = product.category_name
      ? product.category_name.toLowerCase()
      : "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      description.includes(searchText) ||
      city.includes(searchText) ||
      category.includes(searchText);

    const productPrice = Number(product.price);

    const matchesMinPrice =
      minPrice === "" || productPrice >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || productPrice <= Number(maxPrice);

    const matchesCity =
      cityFilter === "" || city.includes(cityFilter.toLowerCase());

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCity;
  });

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Buy and Sell Second-Hand Products</h1>
        <p>
          Discover great deals near you on Loop Market. Search, filter, and find
          what you need easily.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products, categories, or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-primary" onClick={() => navigate("/add-product")}>
            Sell Product
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2>Browse Categories</h2>

        <div className="categories-row">
          <button
            className={!selectedCategory ? "category-btn active" : "category-btn"}
            onClick={handleAllCategories}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={
                selectedCategory === category.id
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => handleCategoryClick(category)}
            >
              {category.name || category.category_name}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>Advanced Filters</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <label>Minimum Price</label>
            <input
              type="number"
              placeholder="Example: 100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div>
            <label>Maximum Price</label>
            <input
              type="number"
              placeholder="Example: 1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div>
            <label>City</label>
            <input
              type="text"
              placeholder="Example: Tripoli"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "end" }}>
            <button
              className="btn-light"
              onClick={() => {
                setSearch("");
                setMinPrice("");
                setMaxPrice("");
                setCityFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Latest Products</h2>

        {loading ? (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image_url || "/images/default.jpg"}
                  alt={product.title}
                />

                <div className="product-card-body">
                  <h3>{product.title}</h3>

                  <p className="price">${product.price}</p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {product.category_name || "Not available"}
                  </p>

                  {product.subcategory_name && (
                    <p>
                      <strong>Subcategory:</strong>{" "}
                      {product.subcategory_name}
                    </p>
                  )}

                  <p>
                    <strong>Location:</strong>{" "}
                    {product.city || "Not available"}
                  </p>

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
    </div>
  );
};

export default Home;