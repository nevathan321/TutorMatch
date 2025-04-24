/**
 * Group Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 20, 2025
 *
 * login component for TutorMatch.
 * Handles user login via email or Google login.
 * On successful Google auth, decodes token and proceeds to profile creation.
 * Renders either the login form or the CreateProfile component based on the current step.
 */


import React, { useState } from "react";
import "./login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import tutorImage from "./tutorImage.jpg";
import { useNavigate } from "react-router-dom";

/**
 * Handles user login via email/password or Google OAuth.
 *
 * @param {Object} props
 * @param {Function} props.setIsLoggedIn - Updates app state when login is successful.
 * @param {Function} props.setUserProfile - Stores the logged-in user's profile information.
 *
 * @returns {JSX.Element} Login form with OAuth integration and error handling.
 */
export default function Login({ setIsLoggedIn, setUserProfile }) {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    account_password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

  /**
   * Handles input changes for login form fields.
   *
   * @param {Object} e - The event object from the input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Submits the login form using email and password credentials.
   *
   * @param {Event} e - The form submission event.
   * @async
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(loginForm).toString(),
      });

      const loginResult = await response.json();
      if (loginResult.success) {
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
  };

  /**
   * Handles successful Google login by decoding the token and sending
   * the user email to the backend for authentication.
   *
   * @param {Object} guathResponse - Google OAuth response object containing the JWT token.
   * @async
   * @returns {void}
  */
  const handleLoginSuccess = async (guathResponse) => {
    const token = guathResponse.credential;
    const userGoogleInfo = jwtDecode(token);
    const googleEmail = {email: userGoogleInfo.email}
    
    try {
      const response = await fetch("https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/login/googleLogin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(googleEmail).toString(),
      });

      const loginResult = await response.json();

      if (loginResult.success) {
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

  /**
   * Logs error details when Google login fails.
   *
   * @param {Object} error - Google login error object.
   */
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
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="account_password">Password</label>
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

        <p  className="signup-link">No account yet? 
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => navigate("/signup")}>Sign Up</a>
        </p>
      </div>

      <div className="image-container">
        <img src={tutorImage} alt="profile" />
      </div> 
    </div>
  );
}

/** if (!response.ok) {
  if (result.redirect) {
    setEmailStatus({
      type: "info",
      message: "Authentication required. Redirecting to Google login...",
    });

    const authWindow = window.open("https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/authenticate.php", "googleAuth", "width=600,height=600");

    const checkAuthWindow = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkAuthWindow);
        setEmailStatus({
          type: "info",
          message: "Authentication completed. Trying to send email again...",
        });
        setTimeout(() => {
          handleSendEmail();
        }, 1000);
      }
    }, 500);
  } else {
    setEmailStatus({
      type: "error",
      message: result.error || "Failed to send email. Please try again.",
    });
  }
  return;
} **/