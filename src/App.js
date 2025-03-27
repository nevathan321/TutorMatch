import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Nav from './components/nav/Nav';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/profile/profile';
import Inbox from './pages/inbox/inbox';
import Match from './pages/Match/match';
import Settings from './pages/settings/settings';


function App() {
  return (
    <div className="App">
      <div className='tile'>
        <Router>
          <Nav />

          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/match" element={<Match />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>

      </div>
    </div>
  );
}

export default App;
