import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AdminPanel = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin || admin.role !== "admin") {
      navigate("/");
      return;
    }

    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const usersRes = await axios.get(`${API}/users`);
      const productsRes = await axios.get(`${API}/products`);
      const categoriesRes = await axios.get(`${API}/categories`);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);

      await fetchAllSubcategories(categoriesRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err.response?.data || err);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubcategories = async (categoriesList) => {
    try {
      const subcategoryData = {};

      await Promise.all(
        categoriesList.map(async (category) => {
          const id = category.id || category.category_id;

          const res = await axios.get(`${API}/categories/${id}/subcategories`);

          subcategoryData[id] = res.data;
        })
      );

      setSubcategoriesByCategory(subcategoryData);
    } catch (err) {
      console.error("Fetch subcategories error:", err.response?.data || err);
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/users/${userId}`);

      alert("User deleted successfully");
      fetchAllData();
    } catch (err) {
      console.error("Delete user error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete user"
      );
    }
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/products/${productId}`);

      alert("Product deleted successfully");
      fetchAllData();
    } catch (err) {
      console.error("Delete product error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete product"
      );
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      await axios.post(`${API}/categories`, {
        name: newCategory,
        category_name: newCategory,
      });

      alert("Category added successfully");
      setNewCategory("");
      fetchAllData();
    } catch (err) {
      console.error("Add category error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add category"
      );
    }
  };

  const deleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/categories/${categoryId}`);

      alert("Category deleted successfully");
      fetchAllData();
    } catch (err) {
      console.error("Delete category error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete category"
      );
    }
  };

  const addSubcategory = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      alert("Please choose a category");
      return;
    }

    if (!newSubcategory.trim()) {
      alert("Please enter subcategory name");
      return;
    }

    try {
      await axios.post(`${API}/categories/${selectedCategoryId}/subcategories`, {
        name: newSubcategory,
      });

      alert("Subcategory added successfully");

      setNewSubcategory("");
      setSelectedCategoryId("");

      fetchAllData();
    } catch (err) {
      console.error("Add subcategory error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add subcategory"
      );
    }
  };

  const deleteSubcategory = async (subcategoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subcategory?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/categories/subcategories/${subcategoryId}`);

      alert("Subcategory deleted successfully");
      fetchAllData();
    } catch (err) {
      console.error("Delete subcategory error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete subcategory"
      );
    }
  };

  if (loading) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>Loading admin panel...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="my-ads-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>Admin Panel</h1>
        <p>Manage users, products, categories, and subcategories in Loop Market.</p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/")}>
            Back to Home
          </button>

          <button className="btn-light" onClick={fetchAllData}>
            Refresh
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div className="card">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div className="card">
          <h2>{products.length}</h2>
          <p>Total Products</p>
        </div>

        <div className="card">
          <h2>{categories.length}</h2>
          <p>Total Categories</p>
        </div>
      </div>

      {/* CATEGORIES AND SUBCATEGORIES */}
      <div className="admin-section">
        <h2>Manage Categories</h2>

        <form onSubmit={addCategory}>
          <label>Add New Category</label>

          <div className="button-group">
            <input
              type="text"
              placeholder="Example: Electronics"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button className="btn-primary" type="submit">
              Add Category
            </button>
          </div>
        </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {categories.map((cat) => {
            const id = cat.id || cat.category_id;
            const name = cat.name || cat.category_name;

            return (
              <div className="card" key={id}>
                <h3>{name}</h3>

                <button
                  className="btn-danger"
                  onClick={() => deleteCategory(id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>

        <hr style={{ margin: "30px 0", border: "1px solid #e5e7eb" }} />

        <h2>Manage Subcategories</h2>

        <form onSubmit={addSubcategory}>
          <label>Choose Category</label>

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Choose category</option>

            {categories.map((cat) => {
              const id = cat.id || cat.category_id;
              const name = cat.name || cat.category_name;

              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>

          <label>Add New Subcategory</label>

          <div className="button-group">
            <input
              type="text"
              placeholder="Example: Cars, TVs, Sofas"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
            />

            <button className="btn-primary" type="submit">
              Add Subcategory
            </button>
          </div>
        </form>

        <div style={{ marginTop: "25px" }}>
          {categories.map((cat) => {
            const categoryId = cat.id || cat.category_id;
            const categoryName = cat.name || cat.category_name;
            const subcategories = subcategoriesByCategory[categoryId] || [];

            return (
              <div
                key={categoryId}
                className="card"
                style={{ marginBottom: "18px" }}
              >
                <h3>{categoryName}</h3>

                {subcategories.length === 0 ? (
                  <p style={{ color: "#6b7280" }}>No subcategories yet.</p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "12px",
                    }}
                  >
                    {subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#f3f4f6",
                          padding: "8px 10px",
                          borderRadius: "10px",
                        }}
                      >
                        <strong>{sub.name}</strong>

                        <button
                          className="btn-danger"
                          style={{
                            padding: "5px 8px",
                            fontSize: "12px",
                          }}
                          onClick={() => deleteSubcategory(sub.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* USERS */}
      <div className="admin-section">
        <h2>Manage Users</h2>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Admins are protected. You can only delete normal users.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={user.image_url || "/images/default-user.png"}
                        alt="user"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#e5e7eb",
                        }}
                      />

                      <strong>{user.username}</strong>
                    </div>
                  </td>

                  <td>{user.email}</td>
                  <td>{user.phone || "Not added"}</td>

                  <td>
                    <strong
                      style={{
                        color: user.role === "admin" ? "#f59e0b" : "#111827",
                      }}
                    >
                      {user.role}
                    </strong>
                  </td>

                  <td>
                    {user.role === "admin" ? (
                      <button className="btn-light" disabled>
                        Protected Admin
                      </button>
                    ) : (
                      <button
                        className="btn-danger"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="admin-section">
        <h2>Manage Products</h2>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products found.</p>
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
                      <strong>Subcategory:</strong>{" "}
                      {product.subcategory_name}
                    </p>
                  )}

                  <p>
                    <strong>City:</strong>{" "}
                    {product.city || "Not available"}
                  </p>

                  <div className="button-group">
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;