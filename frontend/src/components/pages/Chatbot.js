import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";
import logo from "../../assets/logo.png";
import { IoSend, IoArrowBackCircle } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const navigate = useNavigate();

    const toggleLoginForm = () => setIsLoginOpen(!isLoginOpen);


    // Lấy dữ liệu user từ localStorage
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserData(storedUser);
      }
    }, []);

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

    const handleSendClick = async () => {
      if (inputMessage.trim() === "" && !selectedImage) return;
    
      // Thêm thông tin người dùng nếu có
      const userPreferences = {
        height: userData?.height || null, // Chiều cao từ localStorage (nếu có)
        weight: userData?.weight || null, // Cân nặng từ localStorage (nếu có)
      };
    
      // Hiển thị tin nhắn của người dùng ngay lập tức
      const userMessage = {
        text: inputMessage,
        sender: "user",
        image: selectedImage,
      };
      setMessages((prev) => [...prev, userMessage]);
    
      try {
        const formData = new FormData();
        formData.append("message", inputMessage);
        formData.append("userPreferences", JSON.stringify(userPreferences));
    
        if (selectedImage) {
          formData.append("file", selectedImage);
        }
    
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          body: formData, // Gửi dữ liệu dưới dạng form-data
        });
    
        if (response.ok) {
          const data = await response.json();
          const aiMessage = { text: data.reply, sender: "ai" };
          setMessages((prev) => [...prev, aiMessage]); // Hiển thị phản hồi từ AI
        } else {
          console.error("Lỗi khi gửi tin nhắn đến backend");
        }
      } catch (error) {
        console.error("Lỗi mạng:", error);
      }
    
      setInputMessage(""); // Xóa input sau khi gửi
      setSelectedImage(null);
    };
    
    // Thêm sự kiện khi nhấn Enter
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendClick();
      }
    };
    

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
      }
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

    return (
      <div className="chatbot-container">
        {/* Header */}
        <header className="header">
          <div className="back-container">
            <div className="backicon-icon" onClick={handleBackClick}>
              <IoArrowBackCircle />
            </div>
          </div>

          <div className="logo">
            <h1>FASHION YOUR WAY WITH AISTYLISH</h1>
          </div>

          {/* Profile + Dropdown Menu */}
          <div className="right-icons">
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
                <span className="login-text" onClick={toggleLoginForm}>Sign in</span>
              )}
            </div>
          </div>
        </header>
        {/* Hiển thị form đăng nhập khi nhấn vào "Đăng nhập" */}
        {isLoginOpen && (
          <div className="login-overlay">
            <div className="login-container">
              <button className="close-btn" onClick={toggleLoginForm}>✖</button>
              <Login setUserData={setUserData} closeLogin={toggleLoginForm} />
            </div>
          </div>
        )}

        {/* Chat Content */}
        <main className="chat-area">
          <div className="chat-box">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender === "user" ? "right" : "left"}`}
              >
                {message.sender === "ai" && (
                  <img src={logo} alt="AI Logo" className="logo-image" />
                )}
                <div className={`message-content ${message.sender}`}>
                  {message.text}
                  {message.image && (
                    <img src={message.image} alt="Selected" className="message-image" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Area */}
          <div className="input-area">
            <div className="add-image-icon" onClick={() => document.getElementById('image-upload').click()}>
              <RiImageAddFill />
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />

            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}

            <input
              type="text"
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown} 
              placeholder="Nhập thông tin để hỗ trợ tìm kiếm sản phẩm..."
            />

            <div className="send-container" onClick={handleSendClick}>
              <IoSend className="send-icon" />
            </div>
          </div>
        </main>
      </div>
    );
};

export default Chatbot;
