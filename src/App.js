import React, { useState } from "react";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Nav from "./components/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/profile/profile";
import Inbox from "./pages/inbox/inbox";
import Match from "./pages/Match/match";
import { NotificationProvider } from "./context/NotificationContext";
import ToastContainer from "./components/ToastContainer/ToastContainer";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Singup";
// switch root path when uploading to filezilla
// const ROOT_PATH = "/~bhavanaa/TutorMatch";
const ROOT_PATH = "/";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null) ;
  if (!isLoggedIn) {
    return (
      <Router basename={ROOT_PATH}>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />}/>
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile}/>} />
        </Routes>
      </Router>
    );
  }
  console.log(userProfile)
  return (
    <NotificationProvider>
      <div className="App">
        <div className="tile">
          <Router basename={ROOT_PATH}>
            <Nav />
            <div className="page">
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Dashboard />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/match" element={<Match />} />
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
