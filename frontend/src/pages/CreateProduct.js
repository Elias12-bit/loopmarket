import React, { useEffect, useState } from "react";
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

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [cityId, setCityId] = useState("");

  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");

  const [images, setImages] = useState([]);

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
      alert("Failed to load categories");
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API}/locations/cities`);
      setCities(res.data);
    } catch (err) {
      console.error("Fetch cities error:", err.response?.data || err);
      alert("Failed to load cities");
    }
  };

  const fetchSubcategories = async (selectedCategoryId) => {
    try {
      setSubcategoryId("");
      setSubcategories([]);

      if (!selectedCategoryId) return;

      const res = await axios.get(
        `${API}/categories/${selectedCategoryId}/subcategories`
      );

      setSubcategories(res.data);
    } catch (err) {
      console.error("Fetch subcategories error:", err.response?.data || err);
      alert("Failed to load subcategories");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    setCategoryId(selectedCategoryId);
    fetchSubcategories(selectedCategoryId);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    setImages((prevImages) => [...prevImages, ...selectedFiles]);

    e.target.value = "";
  };

  const removeSelectedImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const uploadImagesToSupabase = async () => {
    const imageUrls = [];

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
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("loopmarket-images")
        .getPublicUrl(filePath);

      imageUrls.push(data.publicUrl);
    }

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      !categoryId ||
      !cityId
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (subcategories.length > 0 && !subcategoryId) {
      alert("Please choose a subcategory");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await uploadImagesToSupabase();

      const locationRes = await axios.post(`${API}/locations`, {
        city_id: cityId,
        street,
        building,
      });

      const locationId = locationRes.data.location_id;

      await axios.post(`${API}/products`, {
        title,
        description,
        price,
        user_id: user.id,
        category_id: categoryId,
        subcategory_id: subcategoryId || null,
        location_id: locationId,
        image_urls: imageUrls,
      });

      alert("Product added successfully");
      navigate("/my-ads");
    } catch (err) {
      console.error("Add product error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-ads-container">
      <div className="home-hero">
        <h1>Sell a Product</h1>
        <p>Add your product details and upload up to 5 photos.</p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>

      <div className="admin-section">
        <form onSubmit={handleSubmit}>
          <label>Product Title *</label>
          <input
            type="text"
            placeholder="Example: Toyota Truck"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description *</label>
          <textarea
            placeholder="Describe your product..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
          />

          <label>Price *</label>
          <input
            type="number"
            placeholder="Example: 5000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Category *</label>
          <select value={categoryId} onChange={handleCategoryChange}>
            <option value="">Choose category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || category.category_name}
              </option>
            ))}
          </select>

          {subcategories.length > 0 && (
            <>
              <label>Subcategory *</label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
              >
                <option value="">Choose subcategory</option>

                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>City *</label>
          <select value={cityId} onChange={(e) => setCityId(e.target.value)}>
            <option value="">Choose city</option>

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
          />

          <label>Building</label>
          <input
            type="text"
            placeholder="Example: Abbas Building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          />

          <label>Product Images *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            You can upload up to 5 images.
          </p>

          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "15px",
                marginTop: "15px",
                marginBottom: "20px",
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeSelectedImage(index)}
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "26px",
                      height: "26px",
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
      </div>
    </div>
  );
};

export default CreateProduct;