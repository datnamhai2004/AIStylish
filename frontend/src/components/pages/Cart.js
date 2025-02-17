import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);



  // 🛒 Tính tổng giá trị đơn hàng
  const totalAmount = cartItems.reduce((total, item) => total + item.totalPrice, 0);


  // 🛠 Xử lý khi nhấn "Thanh toán"
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống! Hãy thêm sản phẩm trước khi thanh toán.");
      return;
    }

    alert(`Bạn đã thanh toán thành công đơn hàng trị giá ₫${totalAmount.toLocaleString()}`);
    localStorage.removeItem("cart"); // Xóa giỏ hàng sau khi thanh toán
    setCartItems([]); // Cập nhật UI
    navigate("/"); // Quay lại trang chủ sau khi thanh toán
  };
  
  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * parseInt(item.price.replace(/[₫,.]/g, ""), 10) }
          : item
      )
    );
  };
  
  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * parseInt(item.price.replace(/[₫,.]/g, ""), 10) }
          : item
      ).filter((item) => item.quantity > 0) // Xóa sản phẩm nếu quantity = 0
    );
  };
  
  
  const handleRemoveFromCart = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    // Thêm thông báo khi xóa
    setNotification(`Đã xóa sản phẩm khỏi giỏ hàng!`);
    setTimeout(() => setNotification(null), 3000);
  };
  
  

  return (
    <div className="cart-page">
      <div className="title">
        <h2>Giỏ hàng của bạn</h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Giỏ hàng trống</p>
      ) : (
        <>
          <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.img} alt={item.name} className="cart-image"/>
              <div className="cart-info">
                <p className="cart-name">{item.name}</p>
                <p className="cart-price">Giá: {item.price}</p>
                <p className="cart-total">Tổng: ₫{item.totalPrice.toLocaleString()}</p>

                {/* Tăng/Giảm số lượng */}
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>Xóa</button>
              </div>
            </li>
          ))}
          </ul>

          {/* 🛒 Hiển thị tổng tiền */}
          <div className="cart-summary">
            <h3>Tổng thanh toán: <span className="total-amount">₫{totalAmount.toLocaleString()}</span></h3>
            <button className="checkout-btn" onClick={handleCheckout}>Thanh toán</button>
          </div>

        </>
      )}

      {/* 🛠 Nút quay lại trang chủ */}
      <button className="back-btn" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

    </div>
  );
};

export default Cart;
