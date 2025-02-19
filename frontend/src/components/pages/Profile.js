import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { IoArrowBackCircle } from "react-icons/io5"; // Icon quay lại

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
    } else {
      navigate("/"); // Nếu chưa đăng nhập, quay về trang chủ
    }
  }, [navigate]);

  return (
    <div className="profile-container">
      {/* ✅ Đặt nút quay lại trong div riêng */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBackCircle className="back-icon" /> Quay lại
        </button>
      </div>

      <h1>Thông tin cá nhân</h1>
      {userData ? (
        <div className="profile-card">
          <img src={userData.photoURL} alt="User Avatar" className="profile-avatar" />
          <div className="profile-info">
            <p><strong>Tên:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        </div>
      ) : (
        <p>Không có thông tin người dùng.</p>
      )}
    </div>
  );
};

export default Profile;
