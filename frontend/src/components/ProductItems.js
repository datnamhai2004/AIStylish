import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

const ProductItem = ({ product, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="product-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Nhãn New */}
      {product.isNew && <div className="new-label">New</div>}

      {/* Hiệu ứng hover đổi ảnh */}
      <div className="product-image-container">
        <img
          src={product.img}
          alt={product.name}
          className={`product-image ${isHovered ? "hidden" : "visible"}`}
        />
        <img
          src={product.hoverImg}
          alt={product.name}
          className={`product-image hover ${isHovered ? "visible" : "hidden"}`}
        />
      </div>

      <p className="brand">AI Stylish</p>
      <h3>{product.name}</h3>
      <p className="product-price">{product.price}</p>

      {/* Hiển thị icon khi hover */}
      <div className={`product-actions ${isHovered ? "show" : ""}`}>
        <button className="cart-btn"  onClick={() => addToCart(product)}>
          <FaShoppingCart />
        </button>
        <button className="view-btn">
          <AiOutlineEye />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
