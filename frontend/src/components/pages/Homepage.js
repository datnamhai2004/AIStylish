import React, { useState, useEffect, useRef } from "react";
import "../styles/Homepage.css";
import { FaShoppingCart, FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaYoutube } 
from "react-icons/fa";import { IoMenu,IoSearch  } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RiRobot3Line } from "react-icons/ri";
import ProductItem from "../ProductItems"; // Import component sản phẩm
import Slideshow from "../Slideshow";
import Login from "../pages/Login";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const cartRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    // Đóng giỏ hàng khi click ra ngoài
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmenu = (category) => {
    setActiveSubmenu(activeSubmenu === category ? null : category);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData(null);
    setIsDropdownOpen(false);
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
  
  

  // Đóng dropdown khi click ra ngoài
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  const toggleLoginForm = () => setIsLoginOpen(!isLoginOpen);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Thêm sự kiện click vào document
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    // 🛠 Hiển thị thông báo xóa sản phẩm
    setNotification("🗑 Đã xóa sản phẩm khỏi giỏ hàng!");
    setTimeout(() => setNotification(null), 3000); // Ẩn sau 3s
  };
  
  
  



  const products = [
    {
      id: 1,
      category: "shirt",
      name: "Áo Phao Nam Nữ Siêu Ấm Dáng Lửng Cổ Cao, Áo Phao Basic Cổ Cao",
      price: "₫159.000",
      img: "/products/Ao/AoKhoac/aophao.jpg",
      hoverImg: "/products/Ao/AoKhoac/aophaotrang.jpg",
    },
    {
      id: 2,
      category: "shirt",
      name: "Aokong Đồng phục bóng chày Mỹ nam dáng rộng",
      price: "₫249.000",
      img: "/products/Ao/AoKhoac/aobongchaytrang.jpg",
      hoverImg: "/products/Ao/AoKhoac/aobongchayden.jpg",
    },
    {
      id: 3,
      category: "shirt",
      name: "Áo Khoác nỉ, áo hoodie nỉ Lông Cừu Dày Dặn Phối Kẻ Sọc Tay, Phong Cách Hàn Quốc ",
      price: "₫139.000",
      img: "/products/Ao/AoKhoac/aolongcuutrang.jpg",
      hoverImg: "/products/Ao/AoKhoac/aolongcuuden.jpg",
    },
    {
      id: 4,
      category: "shirt",
      name: "Áo Khoác Nam Hoodie Mũ Liền Khóa Kéo Chất Nỉ Bông Dày Dặn Họa Tiết In Chữ Thời Trang Zenkonu",
      price: "₫160.000",
      img: "/products/Ao/AoKhoac/aohoodiexam.jpg",
      hoverImg: "/products/Ao/AoKhoac/aohoodieden.jpg",
    },
    {
      id: 5,
      category: "trouser",
      name: "Quần jeans baggy nam ống suông rộng màu xanh, đen vải bò dày dặn",
      price: "₫155.000",
      img: "/products/Quan/QuanDai/quanjeanbaggyden1.jpg",
      hoverImg: "/products/Quan/QuanDai/quanjeanbaggyden.jpg",
    },
    {
      id: 6,
      category: "trouser",
      name: "Quần ống rộng chất nỉ dáng suông cao cấp thêu chữ unisex - Quần thể thao nam nữ dày dặn không xù co giãn thoải mái",
      price: "₫139.000",
      img: "/products/Quan/QuanDai/quanongrongtrang.jpg",
      hoverImg: "/products/Quan/QuanDai/quanongrongden.jpg",
    },
    {
      id: 7,
      category: "trouser",
      name: "Quần kaki túi hộp tặng kèm dây xích siêu truất, quần jogger bo chun phong cách Unisex",
      price: "₫134.000",
      img: "/products/Quan/QuanDai/quankaki.jpg",
      hoverImg: "/products/Quan/QuanDai/quankaki1.jpg",
    },
    {
      id: 8,
      category: "trouser",
      name: "Quần Suông Lót Lông Kẻ Caro Ống Rộng Unisex Nam Nữ",
      price: "₫59.000",
      img: "/products/Quan/QuanDai/quansuongden.jpg",
      hoverImg: "/products/Quan/QuanDai/quansuong1.jpg",
    },
    {
      id: 9,
      category: "short",
      name: "Quần Short Unisex Teelab Local Brand Vải Cotton Form Oversize Special Collection Premium",
      price: "₫37.900",
      img: "/products/Quan/QuanShort/shortunisex.jpg",
      hoverImg: "/products/Quan/QuanShort/shortunisextrang.jpg",
    },
    {
      id: 10,
      category: "short",
      name: "Quần short jean nữ rách đẹp lưng cao",
      price: "₫59.000",
      img: "/products/Quan/QuanShort/shortjeannutrang.jpg",
      hoverImg: "/products/Quan/QuanShort/shortjeannuden.jpg",
    },
    {
      id: 11,
      category: "short",
      name: "Quần short jean nam rách vá da chất bò cotton cao cấp",
      price: "₫139.000",
      img: "/products/Quan/QuanShort/shortjeanrachgoiden.jpg",
      hoverImg: "/products/Quan/QuanShort/shortjeanrachgoitrang.jpg",
    },
    {
      id: 12,
      category: "short",
      name: "Quần Short Unisex Basic Thể Thao Phong Cách Hàn Quốc",
      price: "₫59.900",
      img: "/products/Quan/QuanShort/shortunisexbasictrang.jpg",
      hoverImg: "/products/Quan/QuanShort/shortunisexbasicden.jpg",
    }
  ];


  
  return (
    <div className="app" style={{ overflowX: "hidden" }}>
      {/* Thanh điều hướng */}
      <nav className="navbar">
      <div className="nav-left">
          <div className="menu-icon" onClick={toggleMenu}>
            <IoMenu />
          </div>

          {isMenuOpen && (
            <div className="dropdown-menu active" ref={menuRef}>
              <ul>
                <li onClick={() => handleSubmenu("ao")}>
                  Áo {activeSubmenu === "ao" ? "▲" : "▼"}
                  {activeSubmenu === "ao" && (
                    <ul className="submenu">
                      <li><a href="#aokhoac">Áo khoác</a></li>
                      <li><a href="#aosomi">Áo sơ mi</a></li>
                      <li><a href="#aovest">Áo vest</a></li>
                      <li><a href="#vay">Đầm</a></li>
                    </ul>
                  )}
                </li>

                <li onClick={() => handleSubmenu("quan")}>
                  Quần {activeSubmenu === "quan" ? "▲" : "▼"}
                  {activeSubmenu === "quan" && (
                    <ul className="submenu">
                      <li><a href="#quanao">Quần âu</a></li>
                      <li><a href="#quanjean">Quần jean</a></li>
                      <li><a href="#quanshort">Quần short</a></li>
                      <li><a href="#vay">Váy</a></li>
                    </ul>
                  )}
                </li>

                <li onClick={() => handleSubmenu("giay")}>
                  Giày {activeSubmenu === "giay" ? "▲" : "▼"}
                  {activeSubmenu === "giay" && (
                    <ul className="submenu">
                      <li><a href="#giaythethao">Giày thể thao</a></li>
                      <li><a href="#giaycaogot">Giày cao gót</a></li>
                      <li><a href="#dep">Dép</a></li>
                      <li><a href="#guoc">Giày thời trang</a></li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>

        <span className="brand-name">AISTYLISH</span>

        <div className="nav-right">
          <div className={`search-bar ${isSearchOpen ? "active" : ""}`}>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="icon-search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <IoSearch size={18} />
            </button>
          </div>

          <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
            <FaShoppingCart />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </div>
          
          


          {/* Form giỏ hàng dạng dropdown */}
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

          {/* Nếu đã đăng nhập, hiển thị avatar */}
          <div className="profile-icon" ref={dropdownRef}>
            {userData ? (
              <>
                <img 
                  src={userData.photoURL} 
                  alt="User" 
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
              <span className="login-text" onClick={toggleLoginForm}>Sign in</span>
            )}
          </div>
        </div>
      </nav>

      {/* Hiển thị form đăng nhập khi nhấn vào "Đăng nhập" */}
      {isLoginOpen && (
        <div className="login-overlay">
          <div className="login-container">
            <button className="close-btn" onClick={toggleLoginForm}>✖</button>
            <Login setUserData={setUserData} closeLogin={toggleLoginForm} />
          </div>
        </div>
      )}

      {/* Phần hiển thị thông báo khi thêm sp vào giỏ hàng thành công */}
      {notification && (
        <div className="notification-right">
          {notification}
        </div>
      )}



      {/* Slideshow */}
      <Slideshow />

      {/* Danh mục sản phẩm */}
      <div className="main-content">
        <div className="title3"><h2>Áo khoác</h2></div>
        <div className="product-list">
          {products.filter((p) => p.category === "shirt").map((p) => (
            <ProductItem key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>

        <div className="title3"><h2>Quần dài</h2></div>
        <div className="product-list">
          {products.filter((p) => p.category === "trouser").map((p) => (
            <ProductItem key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>

        <div className="title3"><h2>Quần short</h2></div>
        <div className="product-list">
          {products.filter((p) => p.category === "short").map((p) => (
            <ProductItem key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
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

export default Homepage;
