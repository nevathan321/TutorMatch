/**
 * Group Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 20, 2025
 *
 * Description:
 * This is the root component of the TutorMatch React application.
 * It handles initial login detection via localStorage and auto-authenticates users if tokens exist.
 * The component sets up global routing using React Router, context for notifications,
 * and renders major app pages including Dashboard, Inbox, Profile, Match, Login, and Signup.
 * Conditional rendering is used to show login/signup routes if the user is not authenticated.
 */

import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Nav from "./components/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/profile/profile";
import Inbox from "./pages/inbox/inbox";
import Match from "./pages/Match/match";
import { NotificationProvider } from "./context/NotificationContext";
import ToastContainer from "./components/ToastContainer/ToastContainer";
import Login from "./pages/login/login";
import Signup from "./pages/login/Singup";



// switch root path when uploading to filezilla
const ROOT_PATH = "/~xiaol31/TutorMatch/";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);//should be null

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email == null) {
      setIsLoggedIn(false)
      return
    }
    loginOnLoad({ email: email })

  }, []);

  const loginOnLoad = async (email) => {
  try {

      const response = await fetch("https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/login/googleLogin.php", {//use this endpoint cause doesn't require password
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(email).toString(),
      });
      const loginResult = await response.json();

      if (loginResult.success) {
        console.log("Auto Login Successfull:", loginResult);
        setIsLoggedIn(true);
        setUserProfile(loginResult.user_profile);

        return;
      }
      setIsLoggedIn(false)
    } catch (err) {
      console.error("Login error:", err);
    }

  }

  if (isLoggedIn == null) return
  if (!isLoggedIn) {
    return (
      <Router basename={ROOT_PATH}>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />} />
        </Routes>
      </Router>
    );
  } 
  
  return (
    <NotificationProvider>
      <div className="App">
        <div className="tile">
          <Router basename={ROOT_PATH}>
            <Nav />
            <div className="page">
              <Routes>
                <Route path="/profile" element={<Profile userProfile={userProfile} setUserProfile={setUserProfile} setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="*" element={<Dashboard userProfile={userProfile} />} />
                <Route path="/inbox" element={<Inbox userProfile={userProfile} />} />
                <Route path="/match" element={<Match userProfile={userProfile}/>} />
              </Routes>
            </div>
          </Router>
          <ToastContainer />
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;