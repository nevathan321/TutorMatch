/**
 * Group Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 20, 2025
 *
 * Signup component for TutorMatch.
 * Handles user signup via email or Google login.
 * On successful Google auth, decodes token and proceeds to profile creation.
 * Renders either the signup form or the CreateProfile component based on the current step.
 */

import React, { useState } from "react";
import "./login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import tutorImage from "./tutorImage.jpg";
import { useNavigate } from "react-router-dom";
import CreateProfile from "./createProfile";


/**
 * Handles the user signup flow with Google OAuth and redirects to profile creation.
 *
 * @param {Object} props
 * @param {Function} props.setIsLoggedIn - Function to update login state upon successful signup.
 * @param {Function} props.setUserProfile - Function to set user profile data.
 *
 * @returns {JSX.Element} Signup interface and Google login integration.
 */
export default function Signup({ setIsLoggedIn, setUserProfile }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

   /**
   * Handles successful Google signup and extracts user info from JWT
   * 
   * @param {Object} response - Google auth response object
   * @returns {void}
   */
  const handleSingupSuccess = (response) => {
    const token = response.credential;
    const userInfo = jwtDecode(token);

    setEmail(userInfo.email)
    setFirstName(userInfo.given_name)
    setLastName(userInfo.family_name)
    setStep("createProfile")
    
  };

   /**
   * Logs error message when Google signup fails
   * 
   * @param {Object} error - Google auth error object
   * @returns {void}
   */

  const handleSignupFailure = (error) => {
    console.error("Google login error:", error);
  };

  /**
   * Handles manual email signup form submission
   * 
   * @param {Event} e - Form submission event
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setStep("createProfile");
  };

  // Renders the CreateProfile component if step is "createProfile"
  if (step === "createProfile") {
    return (
      <CreateProfile
        setIsLoggedIn={setIsLoggedIn}
        setUserProfile={setUserProfile}
        email={email}
        firstName={firstName}
        lastName={lastName}
      />
    );
  }

  // Renders the signup form if step is "signup"
  if (step === "signup") {
    return (
      <div className="login-page">
        <div className="login-container">
          <h1>TutorMatch</h1>
          <h2>Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Signup
            </button>
          </form>

          <div className="social-login">
            <GoogleLogin
              onSuccess={handleSingupSuccess}
              onError={handleSignupFailure}
            />
          </div>

          <div className="divider"></div>

          <p className="signup-link">
            Already have an account?{" "}
            <a onClick={() => navigate("/login")}>Login</a>
          </p>
        </div>

        <div className="image-container">
          <img src={tutorImage} alt="Tutor" />
        </div>
      </div>
    );
  }
}
