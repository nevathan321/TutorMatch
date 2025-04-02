import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Nav from './components/nav/Nav';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/profile/profile';
import Inbox from './pages/inbox/inbox';
import Match from './pages/Match/match';
import Login from './pages/login/login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn){
    return <Login setIsLoggedIn={setIsLoggedIn}/>
  }
  return (
    <div className="App">
      <div className='tile'>
        <Router>
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

      </div>
    </div>
  );
}

export default App; 
