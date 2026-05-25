import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";
import supabase from "../supabaseClient";

const CreateProduct = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCategories();
    fetchCities();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err.response?.data || err);
      setError("Failed to load categories");
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API}/locations/cities`);
      setCities(res.data);
    } catch (err) {
      console.error("Fetch cities error:", err.response?.data || err);
      setError("Failed to load cities");
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];

    if (newImages.length > 5) {
      alert("You can upload maximum 5 photos.");
      e.target.value = "";
      return;
    }

    setImages(newImages);
    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const uploadImagesToSupabase = async () => {
    const uploadedUrls = [];

    for (const image of images) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("loopmarket-images")
        .upload(filePath, image);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from("loopmarket-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      !categoryId ||
      !cityId ||
      !street.trim()
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Upload photos to Supabase first
      const imageUrls = await uploadImagesToSupabase();

      // 2. Create location
      const locRes = await axios.post(`${API}/locations`, {
        city_id: cityId,
        street,
        building,
      });

      const location_id =
        locRes.data.location_id || locRes.data.id || locRes.data.insertId;

      if (!location_id) {
        throw new Error("Location was not created correctly");
      }

      // 3. Save product + image URLs in MySQL
      await axios.post(`${API}/products`, {
        title,
        description,
        price,
        user_id: user.id,
        category_id: categoryId,
        location_id,
        image_urls: imageUrls,
      });

      alert("Product added successfully");
      navigate("/my-ads");
    } catch (err) {
      console.error("Add product error:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong adding product";

      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedCity = cities.find(
    (city) => Number(city.id) === Number(cityId)
  );

  const selectedCategory = categories.find(
    (cat) => Number(cat.id || cat.category_id) === Number(categoryId)
  );

  if (!user) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>Add Product</h1>
          <p>You need to login or create an account to add a product.</p>

          <div className="button-group" style={{ justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>

            <button className="btn-dark" onClick={() => navigate("/signup")}>
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-ads-container">
      <div className="home-hero">
        <h1>Add New Product</h1>
        <p>Create a new listing and upload photos permanently.</p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/my-ads")}>
            Back to My Ads
          </button>

          <button className="btn-light" onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "25px",
          alignItems: "start",
        }}
      >
        <form onSubmit={handleSubmit}>
          <h2>Product Information</h2>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "18px",
                fontWeight: "700",
              }}
            >
              {error}
            </div>
          )}

          <label>Product Title</label>
          <input
            type="text"
            placeholder="Example: iPhone 13 Pro Max"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Describe your product condition and details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Price</label>
          <input
            type="number"
            placeholder="Example: 250"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select category</option>

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

          <h2 style={{ marginTop: "25px" }}>Location</h2>

          <label>City</label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            required
          >
            <option value="">Select city</option>

            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
                {city.governorate_name ? ` - ${city.governorate_name}` : ""}
              </option>
            ))}
          </select>

          <label>Street</label>
          <input
            type="text"
            placeholder="Example: Mina Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />

          <label>Building</label>
          <input
            type="text"
            placeholder="Example: Abbas Building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          />

          <h2 style={{ marginTop: "25px" }}>Photos</h2>

          <label>Product Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <p style={{ color: "#6b7280", marginTop: "-10px" }}>
            You can upload up to 5 photos.
          </p>

          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              {images.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt="selected product"
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      background: "#e5e7eb",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="button-group">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Adding Product..." : "Add Product"}
            </button>

            <button
              className="btn-light"
              type="button"
              onClick={() => navigate("/my-ads")}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="card">
          <h2>Preview</h2>

          <img
            src={
              images.length > 0
                ? URL.createObjectURL(images[0])
                : "/images/default.jpg"
            }
            alt="preview"
            style={{
              width: "100%",
              height: "230px",
              objectFit: "cover",
              borderRadius: "16px",
              background: "#e5e7eb",
              marginBottom: "15px",
            }}
          />

          <h3>{title || "Product title"}</h3>

          <p className="price">${price || "0"}</p>

          <p style={{ color: "#6b7280" }}>
            {description || "Product description will appear here."}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {selectedCategory
              ? selectedCategory.name || selectedCategory.category_name
              : "Not selected"}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {selectedCity
              ? `${selectedCity.name}${
                  selectedCity.governorate_name
                    ? ` - ${selectedCity.governorate_name}`
                    : ""
                }`
              : "Not selected"}
          </p>

          <p>
            <strong>Street:</strong> {street || "Not added"}
          </p>

          <p>
            <strong>Building:</strong> {building || "Not added"}
          </p>

          <p>
            <strong>Photos:</strong> {images.length}
          </p>

          <p>
            <strong>Seller:</strong> {user.username || "User"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;