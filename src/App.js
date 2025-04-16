import React, { useState } from "react";
import "./App.css";
import Dashboard from "./TUTEE/pages/dashboard/Dashboard";
import Nav from "./TUTEE/components/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./TUTEE/pages/profile/profile";
import Inbox from "./TUTEE/pages/inbox/inbox";
import Match from "./TUTEE/pages/Match/match";
import { NotificationProvider } from "./TUTEE/context/NotificationContext";
import ToastContainer from "./TUTEE/components/ToastContainer/ToastContainer";
import Login from "./TUTEE/pages/login/login";
import Signup from "./TUTEE/pages/login/Singup";
// switch root path when uploading to filezilla
const ROOT_PATH = "/";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  if (!isLoggedIn) {
    return (
      <Router basename={ROOT_PATH}>
        <Routes>
          <Route path="TUTEE/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="TUTEE/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />} />
          <Route path="TUTEE/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />} />
        </Routes>
      </Router>
    );
  }
  console.log(userProfile);
  return (
    <NotificationProvider>
      <div className="App">
        <div className="tile">
          <Router basename={ROOT_PATH}>
            <Nav />
            <div className="page">
              <Routes>
                <Route path="TUTEE/profile" element={<Profile />} />
                <Route path="TUTEE/*" element={<Dashboard />} />
                <Route path="TUTEE/inbox" element={<Inbox />} />
                <Route path="TUTEE/match" element={<Match />} />
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