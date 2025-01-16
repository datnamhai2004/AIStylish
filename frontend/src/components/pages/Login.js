import React from 'react';
import "../styles/LoginRegister.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = ({ switchToRegister }) => {
  return (
    <div className='form-box login'>
      <form>
        <h1>Đăng nhập</h1>
        <div className='input-box'>
          <input
            type='text'
            placeholder='Tên người dùng'
            required
          />
          <FaUser className='icon' />
        </div>

        <div className='input-box'>
          <input
            type='password'
            placeholder='Mật khẩu'
            required
          />
          <FaLock className='icon' />
        </div>

        <div className='remember-forgot'>
          <label><input type='checkbox' />Nhớ tài khoản</label>
          <a href='#'>Quên mật khẩu?</a>
        </div>

        <button type='submit'>Đăng nhập</button>

        <div className='register-link'>
          <p>Bạn chưa có tài khoản? <a href='#' onClick={switchToRegister}>Đăng kí</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
