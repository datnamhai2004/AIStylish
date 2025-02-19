import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearch, IoArrowBackCircle } from "react-icons/io5";
import ProductItem from "../ProductItems";
import Login from "../pages/Login";
import "../styles/SearchResults.css";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaYoutube } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";


const SearchResults = ({ products }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q")?.toLowerCase() || "";
    const [isSearchActive, setIsSearchActive] = useState(false); // Trạng thái kiểm soát input tìm kiếm

    const handleSearchIconClick = () => {
        setIsSearchActive(!isSearchActive); // Toggle khi click icon
    };
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [userData, setUserData] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const dropdownRef = useRef(null);
    const cartRef = useRef(null); // ✅ Fix: Define cartRef
    const navigate = useNavigate();

    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserData(storedUser);
        }

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // ✅ Fix: Function to remove items from cart
    const handleRemoveFromCart = (productId) => {
        setCartItems((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== productId);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const handleSearch = () => {
        if (searchInput.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUserData(null);
        setIsDropdownOpen(false);
    };

    const handleBackClick = () => {
        navigate("/");
    };

    const addToCart = (product) => {
      setCartItems((prevCart) => {
        // 🔎 Tìm sản phẩm trong giỏ hàng
        const existingItem = prevCart.find((item) => item.id === product.id);
    
        if (existingItem) {
          // 🔥 Tạo một bản sao mới của giỏ hàng
          const updatedCart = prevCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1, // Tăng số lượng đúng 1
                  totalPrice: (item.quantity + 1) * parseInt(item.price.replace(/[₫,.]/g, ""), 10),
                }
              : item
          );
    
          setNotification(`Đã tăng số lượng sản phẩm!`);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          setTimeout(() => setNotification(null), 3000);
          return updatedCart;
        } else {
          // 🆕 Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
          const updatedCart = [
            ...prevCart,
            { ...product, quantity: 1, totalPrice: parseInt(product.price.replace(/[₫,.]/g, ""), 10) },
          ];
    
          setNotification(`Sản phẩm đã được thêm vào giỏ hàng!`);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          setTimeout(() => setNotification(null), 3000);
          return updatedCart;
        }
      });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="search-results">
            <nav className="navbar">
              {/* Header */}
              <div className="nav-left">
                  <div className="back-button" onClick={handleBackClick}>
                      <IoArrowBackCircle className="icon-back" />
                  </div>
              </div>

              <span className="brand-name">AISTYLISH</span>

                  <div className="nav-right">
                  <div className={`search-bar ${isSearchActive ? "active" : ""}`}>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()} 
                    />
                    <button className="icon-search" onClick={handleSearchIconClick}>
                        <IoSearch size={18} />
                    </button>
                </div>


                      <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
                          <FaShoppingCart />
                          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                      </div>
                      <div className="profile-icon" ref={dropdownRef}>
                          {userData ? (
                              <>
                                  <img 
                                      src={userData.photoURL} 
                                      alt="User Avatar" 
                                      className="user-avatar"
                                      onClick={toggleDropdown} 
                                  />
                                  {isDropdownOpen && (
                                      <div className="dropdown-content">
                                          <ul>
                                              <li onClick={() => navigate("/profile")}>Thông tin cá nhân</li>
                                              <li onClick={() => navigate("/history")}>Lịch sử mua</li>
                                              <li onClick={handleLogout}>Đăng xuất</li>
                                          </ul>
                                      </div>
                                  )}
                              </>
                          ) : (
                              <span className="login-text" onClick={() => setIsLoginOpen(true)}>Sign in</span>
                          )}
                      </div>
                  </div>
            </nav>

            {/* ✅ Cart dropdown with fixed logic */}
            {cartOpen && (
            <div className="cart-dropdown" ref={cartRef}>
              <div className="title4"><h4>Có <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span> sản phẩm trong giỏ hàng</h4></div>

              {cartItems.length === 0 ? (
                <p className="empty-cart-message">Giỏ hàng trống</p>
              ) : (
                <ul>
                  {cartItems.map((item, index) => (
                    <li key={index} className="cart-item">
                      <button className="remove-item" onClick={() => handleRemoveFromCart(item.id)}>✖</button>
                      <img src={item.img} alt={item.name} />
                      <div>
                        <p>{item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}</p>
                        <p>Giá: {item.price}</p>
                        <p>Số lượng: <strong>{item.quantity}</strong></p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <button className="xemgiohang" onClick={() => navigate("/cart")}>Xem giỏ hàng</button>
            </div>
          )}

          {notification && (
            <div className="notification-right">
              {notification}
            </div>
          )}

            {/* Login modal */}
            {isLoginOpen && (
                <div className="login-overlay">
                    <div className="login-container">
                        <button className="close-btn" onClick={() => setIsLoginOpen(false)}>✖</button>
                        <Login setUserData={setUserData} closeLogin={() => setIsLoginOpen(false)} />
                    </div>
                </div>
            )}

            <div className="result-container">
              <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
              {filteredProducts.length > 0 ? (
                  <div className="product-list">
                      {filteredProducts.map((p) => (
                          <ProductItem key={p.id} product={p} addToCart={addToCart} />
                      ))}
                  </div>
              )
              : (
                <p>Không tìm thấy sản phẩm.</p>
              )}
            </div>


            {/* Chatbot */}
            <div className="chatbot">
              <div className="chat-icon" onClick={() => navigate("/chatbot")}>
                <RiRobot3Line />
              </div>
            </div>
              {/* FOOTER */}
              <footer className="footer">
                <div className="footer-container">
                  <div className="footer-column">
                    <h3>Thời trang AISTYLISH</h3>
                      <p>
                        Hệ thống thời trang hàng đầu Việt Nam, hướng tới phong cách cá tính, lịch lãm và trẻ trung.
                      </p>
                      <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                      </div>
            
                      <h4>Phương thức thanh toán</h4>
                      <div className="payment-methods">
                        <img src="/products/Payment/VNPAY.png" alt="VNPay" />
                        <img src="/products/Payment/zalopay.png" alt="ZaloPay" />
                        <img src="/products/Payment/moca.jpg" alt="Moca" />
                        <img src="/products/Payment/Kredivo.png" alt="Kredivo" />
                        <img src="/products/Payment/Napas.png" alt="Napas" />
                        <img src="/products/Payment/visa.png" alt="Visa" />
                      </div>
                    </div>
            
                    <div className="footer-column">
                      <h3>Thông tin liên hệ</h3>
                      <p><strong>Địa chỉ: </strong>số 13 Trịnh Văn Bô, phường Xuân Phương, Quận Nam Từ Liêm, Thành phố Hà Nội </p>
                      <p><strong>Điện thoại: </strong>0985563214 </p>
                      <p><strong>Email: </strong>AIStylish@gmail.com</p>
                      <h4>Phương thức vận chuyển</h4>
                      <div className="shipping-methods">
                        <img src="/products/Payment/ghn.png" alt="GHN Express" />
                        <img src="/products/Payment/ninja.png" alt="Ninja Van" />
                        <img src="/products/Payment/ahamove.png" alt="Ahamove" />
                        <img src="/products/Payment/j&t.png" alt="J&T Express" />
                      </div>
                    </div>
            
                    <div className="footer-column">
                      <h3>Nhóm liên kết</h3>
                      <ul className="list">
                        <li><a href="#timkiem">Tìm kiếm</a></li>
                        <li><a href="#gioithieu">Giới thiệu</a></li>
                        <li><a href="#doitra">Chính sách đổi trả</a></li>
                        <li><a href="#baomat">Chính sách bảo mật</a></li>
                        <li><a href="#tuyendung">Tuyển dụng</a></li>
                        <li><a href="#lienhe">Liên hệ</a></li>
                      </ul>
                    </div>
            
                    <div className="footer-column">
                      <h3>Đăng ký nhận tin</h3>
                      <p>Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá khác.</p>
                      <div className="subscribe">
                        <input type="email" placeholder="Nhập email của bạn" />
                        <button>Đăng ký</button>
                      </div>
                    </div>
                  </div>
              </footer>
        </div>


    );
};

export default SearchResults;
