import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import Chatbot from "./components/pages/Chatbot";
import Profile from "./components/pages/Profile";  // Thêm trang thông tin cá nhân
import History from "./components/pages/History";  // Thêm trang lịch sử mua hàng
import Cart from "./components/pages/Cart";
import Paypage from './components/pages/Paypage';
import SearchResults from "./components/pages/SearchResults";

const products = [
  {
    id: 1,
    category: "shirt",
    name: "Áo Phao Nam Nữ Siêu Ấm Dáng Lửng Cổ Cao, Áo Phao Basic Cổ Cao",
    price: "₫359.000",
    img: "/products/Ao/AoKhoac/aophao.jpg",
    hoverImg: "/products/Ao/AoKhoac/aophaotrang.jpg",
  },
  {
    id: 2,
    category: "shirt",
    name: "Áo Đồng phục bóng chày Mỹ nam dáng rộng",
    price: "₫249.000",
    img: "/products/Ao/AoKhoac/aobongchaytrang.jpg",
    hoverImg: "/products/Ao/AoKhoac/aobongchayden.jpg",
  },
  {
    id: 3,
    category: "shirt",
    name: "Áo Khoác nỉ, áo hoodie nỉ Lông Cừu Dày Dặn Phối Kẻ Sọc Tay, Phong Cách Hàn Quốc ",
    price: "₫239.000",
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
    price: "₫234.000",
    img: "/products/Quan/QuanDai/quankaki.jpg",
    hoverImg: "/products/Quan/QuanDai/quankaki1.jpg",
  },
  {
    id: 8,
    category: "trouser",
    name: "Quần Suông Lót Lông Kẻ Caro Ống Rộng Unisex Nam Nữ",
    price: "₫159.000",
    img: "/products/Quan/QuanDai/quansuongden.jpg",
    hoverImg: "/products/Quan/QuanDai/quansuong1.jpg",
  },
  {
    id: 9,
    category: "short",
    name: "Quần Short Unisex Teelab Local Brand Vải Cotton Form Oversize Special Collection Premium",
    price: "₫137.900",
    img: "/products/Quan/QuanShort/shortunisex.jpg",
    hoverImg: "/products/Quan/QuanShort/shortunisextrang.jpg",
  },
  {
    id: 10,
    category: "short",
    name: "Quần short jean nữ rách đẹp lưng cao",
    price: "₫250.000",
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
    price: "₫259.900",
    img: "/products/Quan/QuanShort/shortunisexbasictrang.jpg",
    hoverImg: "/products/Quan/QuanShort/shortunisexbasicden.jpg",
  }
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pay" element={<Paypage />} />
        <Route path="/search" element={<SearchResults products={products} />} />
        <Route path="/profile" element={<Profile />} />  
        <Route path="/history" element={<History />} />  
      </Routes>
    </Router>
  );
};

export default App;
