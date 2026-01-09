import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

const AddSales = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || price <= 0 ) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
    

      await axios.post("http://localhost:5000/sales", {
        title,
        description,
        price: Number(price),
      });

      navigate("/sales");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while adding the sale.");
    } 
  };

  return (
    <div className="form-container">
      <h2>Add Sale</h2>

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
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
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <button type="submit">Add Sale</button>
            {error && <p style={{ color: "red" }}>Something went wrong!</p>}
      </form>

      <Link to="/sales">Back to Sales</Link>
    </div>
  );
};

export default AddSales;