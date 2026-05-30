import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
    fetchAllCategoryProducts();
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      const categoryRes = await axios.get(`${API}/categories/${id}`);
      const subcategoriesRes = await axios.get(
        `${API}/categories/${id}/subcategories`
      );

      setCategory(categoryRes.data);
      setSubcategories(subcategoriesRes.data);
    } catch (err) {
      console.error("Category fetch error:", err.response?.data || err);
      alert("Failed to load category");
    }
  };

  const fetchAllCategoryProducts = async () => {
    try {
      setLoading(true);
      setSelectedSubcategory(null);

      const res = await axios.get(`${API}/products?category_id=${id}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Products fetch error:", err.response?.data || err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategoryProducts = async (subcategory) => {
    try {
      setLoading(true);
      setSelectedSubcategory(subcategory);

      const res = await axios.get(
        `${API}/products?category_id=${id}&subcategory_id=${subcategory.id}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error("Subcategory products error:", err.response?.data || err);
      alert("Failed to load subcategory products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-ads-container">
      <div className="home-hero">
        <h1>{category ? category.name : "Category"}</h1>
        <p>
          Browse products in{" "}
          <strong>{category ? category.name : "this category"}</strong>
        </p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2>Subcategories</h2>

        <div className="categories-row">
          <button
            className={!selectedSubcategory ? "category-btn active" : "category-btn"}
            onClick={fetchAllCategoryProducts}
          >
            See all in {category ? category.name : "Category"}
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.id}
              className={
                selectedSubcategory?.id === sub.id
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => fetchSubcategoryProducts(sub)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>
          {selectedSubcategory
            ? selectedSubcategory.name
            : category
            ? `All in ${category.name}`
            : "Products"}
        </h2>

        {loading ? (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>There are no products in this section yet.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
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
                      <strong>Subcategory:</strong> {product.subcategory_name}
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

export default CategoryPage;