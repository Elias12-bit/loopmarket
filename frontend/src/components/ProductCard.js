import React from "react";

const ProductCard = ({ image, title, description, price }) => {
  return (
    <div style={styles.card}>

      <img
        src={image || "/images/default.jpg"}
        alt={title}
        style={styles.image}
      />

      <h3>{title}</h3>

      <p>{description}</p>

      {price && <h4>${price}</h4>}

    </div>
  );
};

const styles = {
  card: {
    width: "250px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    margin: "10px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
  },
};

export default ProductCard;