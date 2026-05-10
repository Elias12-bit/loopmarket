import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [locationText, setLocationText] = useState("");
  const [condition, setCondition] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://loopmarket-backend1.onrender.com/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ create location (FIXED using locationText)
      const locRes = await axios.post("https://loopmarket-backend1.onrender.com/locations", {
        name: locationText,
      });

      const location_id = locRes.data.location_id;

      // 2️⃣ create product
      await axios.post("https://loopmarket-backend1.onrender.com/products", {
        title,
        description,
        price,
        image_url: image,
        user_id: user?.id, // safe access
        category_id: categoryId,
        location_id,
        condition,
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit}>

        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Location:</label>
        <input
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          required
        />

        <label>Condition:</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
        >
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>

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

        <label>Image URL:</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button type="submit">Add Product</button>

        {error && (
          <p style={{ color: "red" }}>Something went wrong</p>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;