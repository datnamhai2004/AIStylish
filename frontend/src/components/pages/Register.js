import React, { useState } from 'react';
import "../styles/LoginRegister.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios';
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import googleLogo from '../../assets/google.png'; // Nhập ảnh từ thư mục assets

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(formData.email)) {
      alert('Vui lòng nhập email đúng định dạng @gmail.com!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users', formData);
      alert('Đăng ký thành công!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User registered with Google:", user);

      const googleData = {
        username: user.displayName || "Google User",
        email: user.email,
        password: "google-auth",
      };

      try {
        const response = await axios.post('http://localhost:5000/users', googleData);
        alert('Đăng ký với Google thành công!');
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        alert('Đăng ký thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      alert('Đăng ký bằng Google thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className='form-box register'>
      <form onSubmit={handleRegister}>
        <h1>Đăng kí</h1>
        <div className='input-box'>
          <input
            type='text'
            name='username'
            placeholder='Tên người dùng'
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <FaUser className='icon' />
        </div>

        <div className='input-box'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange}
            pattern='^[a-zA-Z0-9._%+-]+@gmail\.com$'
            title='Vui lòng nhập email đúng định dạng (vd: example@gmail.com)'
            required
          />
          <MdEmail className='icon' />
        </div>

        <div className='input-box'>
          <input
            type='password'
            name='password'
            placeholder='Mật khẩu'
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <FaLock className='icon' />
        </div>

        <div className='remember-forgot'>
          <label>
            <input type='checkbox' required />
            Tôi đồng ý với các điều khoản và điều kiện
          </label>
        </div>

        <button type='submit' className='button'>Đăng kí</button>

        <div className='divider'>
          <span>OR</span>
        </div>

        <div className='google-login'>
          <button type='button' onClick={handleGoogleRegister}>
            <img
              src={googleLogo} // Sử dụng logo từ assets
              alt='Google Logo'
              className='google-logo'
            />
            Đăng ký bằng Google
          </button>
        </div>

        <div className='register-link'>
          <p>Bạn đã có tài khoản? <a href='#' onClick={switchToLogin}>Đăng nhập</a></p>
        </div>
      </form>
    </div>
  );
};

export default Register;
