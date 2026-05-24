import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    fetchProducts();
  }, []);

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Failed to load categories");
    }
  };

  // =========================
  // ADD CATEGORY
  // =========================
  const addCategory = async () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      await axios.post(
        `${API}/categories`,
        { name: newCategory },
        {
          headers: {
            userid: user?.id,
          },
        }
      );

      setNewCategory("");
      fetchCategories();
      alert("Category added successfully");
    } catch (err) {
      console.error("Add category error:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to add category"
      );
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/categories/${id}`, {
        headers: {
          userid: user?.id,
        },
      });

      fetchCategories();
      alert("Category deleted successfully");
    } catch (err) {
      console.error("Delete category error:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: {
          userid: user?.id,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    if (Number(id) === Number(user?.id)) {
      alert("You cannot delete your own admin account.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: {
          userid: user?.id,
        },
      });

      fetchUsers();
      alert("User deleted successfully");
    } catch (err) {
      console.error("Delete user error:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError("Failed to load products");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: {
          userid: user?.id,
        },
      });

      fetchProducts();
      alert("Listing deleted successfully");
    } catch (err) {
      console.error("Delete product error:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete listing"
      );
    }
  };

  return (
    <div className="admin-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>Admin Dashboard</h1>
        <p>
          Manage users, product listings, and categories from one control panel.
        </p>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: "25px" }}>
          {error}
        </div>
      )}

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card">
          <h3>Total Users</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#f59e0b",
            }}
          >
            {users.length}
          </p>
        </div>

        <div className="card">
          <h3>Total Listings</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#f59e0b",
            }}
          >
            {products.length}
          </p>
        </div>

        <div className="card">
          <h3>Total Categories</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#f59e0b",
            }}
          >
            {categories.length}
          </p>
        </div>

        <div className="card">
          <h3>Logged In As</h3>
          <p style={{ fontWeight: "800" }}>{user?.username || "Admin"}</p>
          <p style={{ color: "#6b7280" }}>{user?.role || "admin"}</p>
        </div>
      </div>

      {/* CATEGORY MANAGEMENT */}
      <section className="admin-section">
        <h3>Manage Categories</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "12px",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Enter new category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCategory();
            }}
            style={{ marginBottom: "0" }}
          />

          <button className="btn-primary" onClick={addCategory}>
            + Add Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories found.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "15px",
            }}
          >
            {categories.map((cat) => {
              const categoryId = cat.id || cat.category_id;
              const categoryName = cat.name || cat.category_name;

              return (
                <div className="card" key={categoryId}>
                  <h3>{categoryName}</h3>

                  <button
                    className="btn-danger"
                    onClick={() => deleteCategory(categoryId)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* USER MANAGEMENT */}
      <section className="admin-section">
        <h3>Manage Users</h3>

        {users.length === 0 ? (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={u.image_url || "/images/default-user.png"}
                          alt="user"
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            background: "#e5e7eb",
                          }}
                        />

                        <strong>{u.username || u.name || "Unknown"}</strong>
                      </div>
                    </td>

                    <td>{u.email || "Not available"}</td>
                    <td>{u.phone || "Not added"}</td>
                    <td>{u.address || "Not added"}</td>

                    <td>
                      <span
                        style={{
                          background:
                            u.role === "admin" ? "#fef3c7" : "#e5e7eb",
                          color: u.role === "admin" ? "#92400e" : "#111827",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontWeight: "800",
                          fontSize: "13px",
                        }}
                      >
                        {u.role || "user"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => deleteUser(u.id)}
                        disabled={Number(u.id) === Number(user?.id)}
                        style={{
                          opacity:
                            Number(u.id) === Number(user?.id) ? "0.5" : "1",
                          cursor:
                            Number(u.id) === Number(user?.id)
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* LISTING MANAGEMENT */}
      <section className="admin-section">
        <h3>Manage Listings</h3>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No listings found.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image_url || "/images/default.jpg"}
                  alt={product.title}
                />

                <h3>{product.title}</h3>

                <p className="price">${product.price}</p>

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

                <p style={{ color: "#6b7280" }}>
                  {product.description
                    ? product.description.substring(0, 90) + "..."
                    : "No description"}
                </p>

                <button
                  className="btn-danger"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete Listing
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;