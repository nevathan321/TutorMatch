import React, { useState } from "react";
import "./login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import tutorImage from "./tutorImage.jpg";
import { useNavigate } from "react-router-dom";
import CreateProfile from "./createProfile";

export default function Signup({ setIsLoggedIn, setUserProfile }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    const userInfo = jwtDecode(token);

    console.log("Decoded token:", userInfo);
    //setIsLoggedIn(true);
  };

  const handleLoginFailure = (error) => {
    console.error("Google login error:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStep("createProfile")
  };

  if (step === "createProfile"){
    return <CreateProfile setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} email={email} />
  }

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
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
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
