import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import supabase from "../supabaseClient";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProduct();
    fetchProductImages();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}`);

      if (Number(res.data.user_id) !== Number(user.id)) {
        alert("You can only edit your own product");
        navigate("/my-ads");
        return;
      }

      setTitle(res.data.title || "");
      setDescription(res.data.description || "");
      setPrice(res.data.price || "");
    } catch (err) {
      console.error("Fetch product error:", err.response?.data || err);
      setError("Failed to load product");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchProductImages = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}/images`);
      setExistingImages(res.data || []);
    } catch (err) {
      console.error("Fetch images error:", err.response?.data || err);
    }
  };

  const handleNewImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const totalImages = existingImages.length + newImages.length + selectedFiles.length;

    if (totalImages > 5) {
      alert("You can have maximum 5 photos.");
      e.target.value = "";
      return;
    }

    setNewImages([...newImages, ...selectedFiles]);
    e.target.value = "";
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages(newImages.filter((_, index) => index !== indexToRemove));
  };

  const uploadNewImagesToSupabase = async () => {
    const uploadedUrls = [];

    for (const image of newImages) {
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

    if (!title.trim() || !description.trim() || !price) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const uploadedNewImageUrls = await uploadNewImagesToSupabase();

      const keptOldImageUrls = existingImages.map((img) => img.image_url);

      const finalImageUrls = [...keptOldImageUrls, ...uploadedNewImageUrls];

      await axios.put(`${API}/products/${id}`, {
        title,
        description,
        price,
        image_urls: finalImageUrls,
      });

      alert("Product updated successfully");
      navigate(`/product/${id}`);
    } catch (err) {
      console.error("Update product error:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update product";

      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="my-ads-container">
        <div className="empty-state">
          <h1>Loading product...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="my-ads-container">
      <div className="home-hero">
        <h1>Edit Product</h1>
        <p>Update your product information and photos.</p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/my-ads")}>
            Back to My Ads
          </button>

          <button className="btn-light" onClick={() => navigate(`/product/${id}`)}>
            View Product
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
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Price</label>
          <input
            type="number"
            placeholder="Product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <h2 style={{ marginTop: "25px" }}>Current Photos</h2>

          {existingImages.length === 0 && newImages.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No photos added yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              {existingImages.map((img) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <img
                    src={img.image_url}
                    alt="product"
                    style={{
                      width: "100%",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      background: "#e5e7eb",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
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

              {newImages.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt="new product"
                    style={{
                      width: "100%",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      background: "#e5e7eb",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
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

          <label>Add More Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
          />

          <p style={{ color: "#6b7280", marginTop: "-10px" }}>
            You can have up to 5 photos total.
          </p>

          <div className="button-group">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
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
              existingImages.length > 0
                ? existingImages[0].image_url
                : newImages.length > 0
                ? URL.createObjectURL(newImages[0])
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
            <strong>Total Photos:</strong>{" "}
            {existingImages.length + newImages.length}
          </p>

          <p>
            <strong>Seller:</strong> {user.username || "User"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;