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
      console.error(err);
      setError("Failed to load categories");
    }
  };

  // =========================
  // ADD CATEGORY
  // =========================
  const addCategory = async () => {
    if (!newCategory.trim()) return;

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
    } catch (err) {
      console.error(err);
      setError("Failed to add category");
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API}/categories/${id}`, {
        headers: {
          userid: user?.id,
        },
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
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
      console.error(err);
      setError("Failed to load users");
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: {
          userid: user?.id,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
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
      console.error(err);
      setError("Failed to load products");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: {
          userid: user?.id,
        },
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  return (
    <div className="admin-container" style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* CATEGORY MANAGEMENT */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Manage Categories</h2>

        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <button onClick={addCategory}>Add Category</button>

        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name}
              <button onClick={() => deleteCategory(cat.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* USER MANAGEMENT */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Manage Users</h2>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.name || u.username} - {u.email}
                <button onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* LISTING MANAGEMENT */}
      <section>
        <h2>Manage Listings</h2>

        {products.length === 0 ? (
          <p>No listings found</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.title} - ${product.price}
                <button onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;