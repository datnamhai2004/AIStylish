import React, { useState, useEffect, useRef } from "react";
import "../styles/Homepage.css";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RiRobot3Line } from "react-icons/ri";
import ProductItem from "../ProductItems"; // Import component sản phẩm
import Slideshow from "../Slideshow";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmenu = (category) => {
    setActiveSubmenu(activeSubmenu === category ? null : category);
  };

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

  const lastScrollY = useRef(window.scrollY);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY.current) {
      setIsNavVisible(false);
    } else {
      setIsNavVisible(true);
    }
    lastScrollY.current = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    {
      id: 1,
      category: "shirt",
      name: "Áo Phao Nam Nữ Siêu Ấm Dáng Lửng Cổ Cao, Áo Phao Basic Cổ Cao",
      price: "₫159.000",
      img: "/products/aophao.jpg",
      hoverImg: "/products/aophaotrang.jpg",
    },
    {
      id: 2,
      category: "shirt",
      name: "Aokong Đồng phục bóng chày Mỹ nam dáng rộng",
      price: "₫249.000",
      img: "/products/aobongchaytrang.jpg",
      hoverImg: "/products/aobongchayden.jpg",
    },
    {
      id: 3,
      category: "shirt",
      name: "Áo Khoác nỉ ,áo hoodie nỉ Lông Cừu Dày Dặn Phối Kẻ Sọc Tay, Phong Cách Hàn Quốc ",
      price: "₫139.000",
      img: "/products/aolongcuutrang.jpg",
      hoverImg: "/products/aolongcuuden.jpg",
    },
    {
      id: 4,
      category: "shirt",
      name: "Áo Khoác Nam Hoodie Mũ Liền Khóa Kéo Chất Nỉ Bông Dày Dặn Họa Tiết In Chữ Thời Trang Zenkonu",
      price: "₫160.200",
      img: "/products/aohoodiexam.jpg",
      hoverImg: "/products/aohoodieden.jpg",
    },
    {
      id: 5,
      category: "trouser",
      name: "Quần jeans baggy nam ống suông rộng màu xanh, đen vải bò dày dặn",
      price: "₫155.000",
      img: "/products/quanjeanbaggyden1.jpg",
      hoverImg: "/products/quanjeanbaggyden.jpg",
    },
    {
      id: 6,
      category: "trouser",
      name: "Quần ống rộng chất nỉ dáng suông cao cấp thêu chữ unisex - Quần thể thao nam nữ dày dặn không xù co giãn thoải mái",
      price: "₫139.000",
      img: "/products/quanongrongtrang.jpg",
      hoverImg: "/products/quanongrongden.jpg",
    },
    {
      id: 7,
      category: "trouser",
      name: "Quần kaki túi hộp tặng kèm dây xích siêu truất, quần jogger bo chun phong cách Unisex",
      price: "₫134.000",
      img: "/products/quankaki.jpg",
      hoverImg: "/products/quankaki1.jpg",
    },
    {
      id: 8,
      category: "trouser",
      name: "Quần Suông Lót Lông Kẻ Caro Ống Rộng Unisex Nam Nữ",
      price: "₫59.000",
      img: "/products/quansuongden.jpg",
      hoverImg: "/products/quansuong1.jpg",
    },
    {
      id: 9,
      category: "short",
      name: "Quần Short Unisex Teelab Local Brand Vải Cotton Form Oversize Special Collection Premium",
      price: "₫37.900",
      img: "/products/shortunisex.jpg",
      hoverImg: "/products/shortunisextrang.jpg",
    },
    {
      id: 10,
      category: "short",
      name: "Quần short jean nữ rách đẹp lưng cao",
      price: "₫59.000",
      img: "/products/shortjeannutrang.jpg",
      hoverImg: "/products/shortjeannuden.jpg",
    },
    {
      id: 11,
      category: "short",
      name: "Quần short jean nam rách vá da chất bò cotton cao cấp",
      price: "₫139.000",
      img: "/products/shortjeanrachgoiden.jpg",
      hoverImg: "/products/shortjeanrachgoitrang.jpg",
    },
    {
      id: 12,
      category: "short",
      name: "Quần Short Unisex Basic Thể Thao Phong Cách Hàn Quốc",
      price: "₫59.900",
      img: "/products/shortunisexbasictrang.jpg",
      hoverImg: "/products/shortunisexbasicden.jpg",
    }
  ];

  return (
    <div className="app">
      {/* Thanh điều hướng */}
      <nav className={`navbar ${isNavVisible ? "" : "hidden"}`}>
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

        <span className="brand-name">Fashion Your Way</span>

        <div className="nav-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>&#128269;</button>
          </div>
          <div className="cart-icon">
            <FaShoppingCart />
          </div>
          <div className="profile-icon">
            <FaUserCircle />
          </div>
        </div>
      </nav>

      {/* Slideshow */}
      <Slideshow />

      {/* Danh mục sản phẩm */}
      <div className="main-content">
        <h2>Áo khoác</h2>
        <div className="product-list">
          {products.filter((p) => p.category === "shirt").map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>

        <h2>Quần dài</h2>
        <div className="product-list">
          {products.filter((p) => p.category === "trouser").map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>

        <h2>Quần short</h2>
        <div className="product-list">
          {products.filter((p) => p.category === "short").map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Chatbot */}
      <div className="chatbot">
        <div className="chat-icon" onClick={() => navigate("/chatbot")}>
          <RiRobot3Line />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
