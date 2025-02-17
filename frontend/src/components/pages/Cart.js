import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // 🛠 Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🛠 Cập nhật màu sắc của sản phẩm
  const updateColor = (index, color) => {
    const updatedCart = cartItems.map((item, i) => 
      i === index ? { ...item, color } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="cart-page">
      <h2>Giỏ hàng của bạn</h2>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.img} alt={item.name} className="cart-image"/>
              <div className="cart-info">
                <p className="cart-name">{item.name}</p>
                <p className="cart-price">Giá: {item.price}</p>

                {/* 🛠 Dropdown chọn màu */}
                <label>Chọn màu: </label>
                <select 
                  value={item.color || "default"} 
                  onChange={(e) => updateColor(index, e.target.value)}
                >
                  <option value="default">Mặc định</option>
                  <option value="Đỏ">Đỏ</option>
                  <option value="Xanh">Xanh</option>
                  <option value="Trắng">Trắng</option>
                  <option value="Đen">Đen</option>
                </select>

                {/* 🛠 Nút xóa sản phẩm */}
                <button className="remove-btn" onClick={() => removeFromCart(index)}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🛠 Nút quay lại trang chủ */}
      <button className="back-btn" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
    </div>
  );
};

export default Cart;
