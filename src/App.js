import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import Chatbot from "./components/pages/Chatbot";
import Profile from "./components/pages/Profile";  // Thêm trang thông tin cá nhân
import History from "./components/pages/History";  // Thêm trang lịch sử mua hàng

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/profile" element={<Profile />} />  {/* Thêm đường dẫn đến trang thông tin cá nhân */}
        <Route path="/history" element={<History />} />  {/* Thêm đường dẫn đến trang lịch sử mua */}
      </Routes>
    </Router>
  );
};

export default App;
