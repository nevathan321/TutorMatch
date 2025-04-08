import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Nav from './components/nav/Nav';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/profile/profile';
import Inbox from './pages/inbox/inbox';
import Match from './pages/Match/match';
import Login from './pages/login/login';
import { NotificationProvider } from './context/NotificationContext';

//switch root path when uploading to filezilla
//const ROOT_PATH = "/~bhavanaa/TutorMatch";
const ROOT_PATH = "/"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn){

    return (
    <Router basename={ROOT_PATH}>
      <Login setIsLoggedIn={setIsLoggedIn}/>
    </Router>
    )
  }
  return (
    
      <div className="App">
        <div className='tile'>
          <NotificationProvider>
            <Router basename={ROOT_PATH}>
              <Nav />
              <div className='page'>

              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/match" element={<Match />} />
              </Routes>
              </div>
            </Router>
          </NotificationProvider>

          </div>
        </div>
     

  );
}

export default App; 
