import React, { useState, useEffect } from "react";
import "../styles/LoginRegister.css";
import { auth, googleProvider, signInWithPopup, facebookProvider } from "../../firebase";
import googleLogo from "../../assets/google.png";
import facebookLogo from "../../assets/facebook.png";

const Login = ({ setUserData, closeLogin }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setUserData(storedUser);
    }
  }, [setUserData]);

 const handleLogin = async (provider) => {
    try {
        const result = await signInWithPopup(auth, provider);
        
        // ✅ Get the Firebase ID token
        const idToken = await result.user.getIdToken();
        console.log("🔥 Firebase ID Token:", idToken);

        const userData = {
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            idToken: idToken // ✅ Store the valid ID Token
        };

        setUser(userData);
        setUserData(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        closeLogin();

        // ✅ Send the token to your backend
        await sendTokenToBackend(idToken);
        
    } catch (error) {
        console.error("❌ Login error:", error);
    }
};

// ✅ Function to send ID Token to backend
const sendTokenToBackend = async (idToken) => {
    try {
        const response = await fetch("http://localhost:5000/sessionLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }), // ✅ Sending real ID Token
        });

        const data = await response.json();
        console.log("✅ Backend Response:", data);
    } catch (error) {
        console.error("❌ Error sending token to backend:", error);
    }
}; 

  return (
    <div className="login-overlay">  {/* ✅ Thêm nền mờ */}
      <div className="form-box login">
        <button className="close-button" onClick={closeLogin}>✖</button> {/* ✅ Nút đóng nằm trong form */}
        <h1>Đăng nhập</h1>
        {user ? (
          <div className="user-info">
            <h3>Chào, {user.name}</h3>
            <p>Email: {user.email}</p>
            <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
          </div>
        ) : (
          <div className="social-login">
            <button className="google-button" onClick={() => handleLogin(googleProvider)}>
              <img src={googleLogo} alt="Google Logo" className="social-logo" />
              Sign in with Google
            </button>

            <button className="facebook-button" onClick={() => handleLogin(facebookProvider)}>
              <img src={facebookLogo} alt="Facebook Logo" className="social-logo" />
              Sign in with Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
