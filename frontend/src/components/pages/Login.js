import React from "react";
import "../styles/LoginRegister.css";
import { FaUser, FaLock } from "react-icons/fa";
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import googleLogo from '../../assets/google.png'; // Nhập ảnh từ thư mục assets

const Login = ({ switchToRegister }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User logged in with Google:", user);
      // Xử lý sau khi đăng nhập thành công, ví dụ: lưu thông tin người dùng
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="form-box login">
      <form>
        <h1>Đăng nhập</h1>
        <div className="input-box">
          <input type="text" placeholder="Tên người dùng" required />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input type="password" placeholder="Mật khẩu" required />
          <FaLock className="icon" />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Nhớ tài khoản
          </label>
          <a href="#">Quên mật khẩu?</a>
        </div>

        <button type="submit" className="button">Đăng nhập</button>

        <div className='divider'>
          <span>OR</span>
        </div>

        <div className="google-login">
          <button type="button" onClick={handleGoogleLogin}>
          <img
            src={googleLogo} // Sử dụng logo từ assets
            alt='Google Logo'
            className='google-logo'
          />
            Đăng nhập bằng Google
          </button>
        </div>

        <div className="register-link">
          <p>
            Bạn chưa có tài khoản?{" "}
            <a href="#" onClick={switchToRegister}>
              Đăng kí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
