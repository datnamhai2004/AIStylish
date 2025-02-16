import React, { useState } from "react";
import "../styles/LoginRegister.css";
import { auth, googleProvider, signInWithPopup, facebookProvider, linkWithCredential, fetchSignInMethodsForEmail } from "../../firebase";
import googleLogo from "../../assets/google.png";
import facebookLogo from "../../assets/facebook.png";

const Login = () => {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User logged in with Google:", result.user);
      setUser(result.user); // ✅ Lưu user vào state để hiển thị
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("User logged in with Facebook:", result.user);
      setUser(result.user); // ✅ Lưu user vào state để hiển thị
    } catch (error) {
      console.error("Facebook login error:", error);
  
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCredential = error.customData.credential;
        const email = error.customData.email;
  
        console.log(`This email (${email}) is already linked with another provider.`);
        
        // Xác định provider cũ mà user đã đăng ký trước đó
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        console.log("Existing sign-in methods:", signInMethods);
  
        if (signInMethods.includes("google.com")) {
          console.log("Logging in with Google to link accounts...");
          const googleResult = await signInWithPopup(auth, googleProvider);
          
          // Liên kết tài khoản Facebook với Google đã đăng nhập
          await linkWithCredential(googleResult.user, pendingCredential);
          console.log("Facebook account successfully linked to Google account!");
  
          setUser(googleResult.user); // ✅ Cập nhật user sau khi liên kết
        } else {
          console.error("User must log in with the original provider first.");
        }
      }
    }
  };

  return (
    <div className="form-box login">
      <h1>Đăng nhập</h1>

      {user ? (
        <div className="user-info">
          <h3>Chào, {user.displayName}</h3>
          <p>Email: {user.email}</p>
          <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
        </div>
      ) : (
        <div className="social-login">
          <button className="google-button" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google Logo" className="social-logo" />
            Đăng nhập bằng Google
          </button>

          <button className="facebook-button" onClick={handleFacebookLogin}>
            <img src={facebookLogo} alt="Facebook Logo" className="social-logo" />
            Đăng nhập bằng Facebook
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
