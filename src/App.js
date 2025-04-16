import React, { useState , useEffect} from "react";
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
const ROOT_PATH = "/";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

   useEffect(() => {
    const email = localStorage.getItem("email");
    if (email == null) {
      setIsLoggedIn(false)
      return
    }
    loginOnLoad({email : email})
    
  }, []);

   const loginOnLoad = async (email) => {

    try {
      const response = await fetch("http://localhost/tutorMatch/server/login/googleLogin.php", {//use this endpoint cause doesn't require password
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
  //if (isLoggedIn == null) return
  if (!isLoggedIn) {
    return (
      <Router basename={ROOT_PATH}>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn}  setUserProfile={setUserProfile}/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />}/>
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile}/>} />
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
                <Route path="/profile" element={<Profile userProfile={userProfile} />} />
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