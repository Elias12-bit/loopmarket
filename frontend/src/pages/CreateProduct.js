import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const CreateProduct = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [cityId, setCityId] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // 1. Create location first
      const locRes = await axios.post(`${API}/locations`, {
        city_id: cityId || 1,
        street,
        building,
      });

      const location_id = locRes.data.location_id;

      // 2. Create product and attach logged-in user as seller
      await axios.post(`${API}/products`, {
        title,
        description,
        price,
        image_url: imageUrl,
        user_id: user.id,
        category_id: categoryId,
        location_id,
      });

      navigate("/my-ads");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Add Product</h2>
        <p>You need to login to add a product.</p>

        <button onClick={() => navigate("/login")}>Login</button>

        <button
          onClick={() => navigate("/signup")}
          style={{ marginLeft: "10px" }}
        >
          Create New Account
        </button>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ padding: "20px" }}>
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <br />

        <label>Category:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <br />

        <label>City ID:</label>
        <input
          type="number"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          placeholder="Example: 1"
        />

        <br />

        <label>Street:</label>
        <input
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />

        <br />

        <label>Building:</label>
        <input
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />

        <br />

        <label>Image URL:</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <br />

        <button type="submit">Add Product</button>

        {error && (
          <p style={{ color: "red" }}>Something went wrong adding product.</p>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;