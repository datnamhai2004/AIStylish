import React, {useState} from 'react'
import "../styles/LoginRegister.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
const LoginRegister = () => {

  const [action, setAction] = useState('');

  const registerLink = () => {
    setAction(' active');
  };

  const loginLink = () => {
    setAction('');
  };

  return (
    <div className={`wrapper${action}`}>
        <div className='form-box login'>
          <form action="">
            <h1>Đăng nhập</h1>
            <div className='input-box'>
              <input type='text' 
                placeholder='Tên người dùng' required />
                <FaUser className='icon'/>
            </div>

            <div className='input-box'>
              <input type='password' 
                placeholder='Mật khẩu' required />
                <FaLock className='icon'/>
            </div>

            <div className='remember-forgot'>
              <label><input type='checkbox'/>Nhớ tài khoản</label>
              <a href='#'>Quên mật khẩu?</a>
            </div>

            <button type='submit'>Đăng nhập</button>

            <div className='register-link'>
              <p>Bạn chưa có tài khoản? <a href='#' onClick={registerLink}>Đăng kí</a></p>
            </div>
          </form>
        </div>

        <div className='form-box register'>
          <form action="">
            <h1>Đăng kí</h1>
            <div className='input-box'>
              <input type='text' 
                placeholder='Tên người dùng' required />
                <FaUser className='icon'/>
            </div>

            <div className='input-box'>
              <input type='email' 
                placeholder='Email' required />
                <MdEmail className='icon'/>
            </div>

            <div className='input-box'>
              <input type='password' 
                placeholder='Mật khẩu' required />
                <FaLock className='icon'/>
            </div>

            <div className='remember-forgot'>
              <label><input type='checkbox'/>Tôi đồng ý với các điều khoản và điều kiện</label>
            </div>

            <button type='submit'>Đăng kí</button>

            <div className='register-link'>
              <p>Bạn đã có tài khoản? <a href='#' onClick={loginLink}>Đăng nhập</a></p>
            </div>
          </form>
        </div>
    </div>
  )
}

export default LoginRegister
