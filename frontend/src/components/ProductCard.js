import React from "react";

const ProductCard = ({ image, title, description, price, age,onRequestClick}) => {
  return (
    <div className="card">
      <img src={image.startsWith("/") ? image : `/images/${image}`} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{price}</p> 
      <p>{age}</p> 
      

    </div>
  );
};

export default ProductCard;
