import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`https://loopmarket-backend1.onrender.com/products/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrice(res.data.price);
        setLocation(res.data.location);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://loopmarket-backend1.onrender.com/products/${id}`, {
        title,
        description,
        price,
        location,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Product</h2>

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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <button type="submit">Update Product</button>

        {error && (
          <p style={{ color: "red" }}>Something went wrong</p>
        )}

      </form>

      <Link to="/">Back Home</Link>
    </div>
  );
};

export default UpdateProduct;