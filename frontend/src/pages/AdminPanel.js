import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState("");

  // 🔐 PROTECTION (IMPORTANT)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    fetchProducts();
  }, []);

  // 📂 CATEGORIES
  const deleteCategory = async (id) => {
    await axios.delete(`${API}/categories/${id}`);
    fetchCategories();
  };

  // 👥 USERS
  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API}/users/${id}`);
    fetchUsers();
  };

  // 🛍️ PRODUCTS
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="admin-container">

      <h1>Admin Panel</h1>

      {/* 📂 ADD CATEGORY */}
      <section>
        <h2>Categories</h2>

        <input
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <button onClick={addCategory}>Add</button>

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

      {/* 👥 USERS */}
      <section>
        <h2>Users</h2>

        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
              <button onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 🛍️ PRODUCTS */}
      <section>
        <h2>Listings</h2>

        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.title} - ${p.price}
              <button onClick={() => deleteProduct(p.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};

export default AdminPanel;