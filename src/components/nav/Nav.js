/**
 * File: Nav.js
 * Team: TutorMatch
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 7, 2025
 *
 * Description:
 * Navigation bar component used across all pages in the application.
 * Provides links to Dashboard, Match, Inbox, and Profile pages.
 * Integrates notification badge and dropdown panel using NotificationContext.
 * Highlights the active link based on current route.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBadge from '../NotificationBadge/NotificationBadge';
import NotificationsPanel from '../NotificationsPanel/NotificationsPanel';
import './Nav.css';



/**
 * Renders the main navigation bar for the application.
 *
 * @returns {JSX.Element} A React component displaying navigation links and notification badge/panel.
 */

function Nav() {
  const location = useLocation(); // lets us know what page we're currently on
  const { unreadCount } = useNotifications(); // grabs how many unread notifications we have
  
  return (
    <nav className="main-nav">
      <div className="nav-logo">
        <Link to="/">
          <img src="/logo192.png" alt="TutorMatch" className="logo" />
          <span>Tutor Match</span>
        </Link>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/match" 
          className={location.pathname === '/match' ? 'active' : ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
          <span>Match</span>
        </Link>
        
        <Link 
          to="/inbox" 
          className={`${location.pathname === '/inbox' ? 'active' : ''} nav-link-with-badge`}
        >
          <div className="nav-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <NotificationBadge count={unreadCount} />
          </div>
          <span>Inbox</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={location.pathname === '/profile' ? 'active' : ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </Link>

         <div className="nav-actions">
          <NotificationsPanel />
        </div>
      </div>
      

    </nav>
  );
}

export default Nav;