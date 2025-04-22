import React, { useState } from "react";
import "./login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import tutorImage from "./tutorImage.jpg";
import { useNavigate } from "react-router-dom";


export default function Login({ setIsLoggedIn, setUserProfile }) {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    account_password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {//regular login
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/tutorMatch/server/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(loginForm).toString(),
      });

      const loginResult = await response.json();
      console.log(loginResult)
      if (loginResult.success) {
        console.log("Login Successfull:", loginResult);
        setIsLoggedIn(true);
        setUserProfile(loginResult.user_profile);
        setErrorMessage("");
        localStorage.setItem("tutorMatch-email", loginResult.user_profile.email); 

        return;
      }
      setErrorMessage("Incorrect email or password");
    } catch (err) {
      console.error("Login error:", err);
    }
  };


  const handleLoginSuccess = async (guathResponse) => {//google login
    const token = guathResponse.credential;
    const userGoogleInfo = jwtDecode(token);
    const googleEmail = {email: userGoogleInfo.email}
    
    console.log(googleEmail)
    try {
      const response = await fetch("http://localhost/tutorMatch/server/login/googleLogin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(googleEmail).toString(),
      });

      const loginResult = await response.json();

      if (loginResult.success) {
        console.log("Login Successfull:", loginResult);
        setIsLoggedIn(true);
        setUserProfile(loginResult.user_profile);
        setErrorMessage("");
        localStorage.setItem("userEmail", loginResult.user_profile.email); 
        return;
      }
      setErrorMessage("Incorrect email or password");
    } catch (err) {
      console.error("Login error:", err);
    }
  }
  

  const handleLoginFailure = (error) => {
    console.error("Google login error:", error);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>TutorMatch</h1>
        <h2>Log In</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              value={loginForm.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label for="account_password">Password</label>
            <input
              type="password"
              id="password"
              name="account_password"
              placeholder="Enter Password"
              value={loginForm.account_password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-footer">
            <p className="error-message">{errorMessage}</p>
            <a href="/" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="social-login">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>

        <div className="divider"></div>

        <p className="signup-link">
          No account yet? <a onClick={() => navigate("/signup")}>Sign Up</a>
        </p>
      </div>

      <div className="image-container">
        <img src={tutorImage} alt="profile" />
      </div>
    </div>
  );
}
