import React, { useState } from "react";
import "../styles/Chatbot.css";
import { TiThMenu } from "react-icons/ti";
import logo from "../../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { IoSend, IoArrowBackCircle  } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Lưu trữ tin nhắn
    const [inputMessage, setInputMessage] = useState(""); // Lưu nội dung nhập
    const [selectedImage, setSelectedImage] = useState(null); // Lưu ảnh đã chọn
    const navigate = useNavigate(); 
    const handleMenuClick = () => {
      console.log("Menu icon clicked!");
    };
  
    const handleProfileClick = () => {
      console.log("Profile icon clicked!");
    };

    const handleBackClick = () => {
      navigate("/");
    };
  
    // Gửi tin nhắn
    const handleSendClick = () => {
      if (inputMessage.trim() === "" && !selectedImage) return; // Không gửi tin nhắn rỗng và ảnh trống
  
      // Thêm tin nhắn người dùng
      const userMessage = {
        text: inputMessage,
        sender: "user",
        image: selectedImage, // Thêm ảnh nếu có
      };
      setMessages((prev) => [...prev, userMessage]);
  
      // Tạo phản hồi từ AI
      const aiMessage = { text: "Đây là phản hồi từ AI", sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
  
      // Xóa nội dung nhập và ảnh đã chọn sau khi gửi
      setInputMessage("");
      setSelectedImage(null);
    };
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Tạo URL tạm thời cho ảnh
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl); // Lưu URL của ảnh vào state
      }
    };
    
  
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
            <h1>Fashion Your Way</h1>
          </div>

          {/* Nhóm profile và menu icon để chúng sát nhau hơn */}
          <div className="right-icons">
            <div className="profile-icon" onClick={handleProfileClick}>
              <FaUserCircle />
            </div>
            <div className="menu-icon" onClick={handleMenuClick}>
              <TiThMenu />
            </div>
          </div>
        </header>

  
        {/* Chat Content */}
        <main className="chat-area">
          {/* Message Display Area */}
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
              style={{ display: 'none' }}  // Ẩn input file
              onChange={handleImageUpload}
            />
  
            {/* Hiển thị ảnh đã chọn trong input */}
            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}
  
            <input
              placeholder="Message AI Stylist"
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
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
