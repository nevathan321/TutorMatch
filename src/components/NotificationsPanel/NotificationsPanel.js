/**
 * NotificationsPanel Component
 * 
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Liyu, Adrian, Abishan
 * 
 * This component renders a notifications panel triggered by a bell icon. It shows a badge count,
 * lists recent notifications, and allows the user to mark them as read or clear them. 
 * Clicking outside the panel closes it. Automatically marks the top 5 as read after opening.
 */


import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBadge from '../NotificationBadge/NotificationBadge';
import './NotificationsPanel.css';

/**
 * Renders the notifications panel with a bell icon, unread badge, and a dropdown list of notifications.
 * 
 * @returns {JSX.Element} A button with notification count and a dropdown panel listing recent alerts.
 */

function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications,
    } = useNotifications();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    /**
     * Detects clicks outside of the notifications panel and closes it if open.
     * 
     * @param {MouseEvent} event - The mouse event triggered by the document listener.
     */
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  /**
   * Toggles the notifications panel open or closed.
   * Automatically marks the top 5 unread notifications as read after a delay.
   */
  const togglePanel = () => {
    
    setIsOpen(!isOpen);

    // Automatically mark top 5 unread notifications as read after opening
    if (!isOpen && unreadCount > 0) {
      setTimeout(() => {
        const visibleNotifications = notifications.slice(0, 5);
        visibleNotifications.forEach(notification => {
          if (!notification.read) {
            markAsRead(notification.id);
          }
        });
      }, 2000);
    }
  };

  /**
   * Marks all notifications in the list as read.
   */
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  /**
   * Clears all notifications from the list.
   */
  const handleClearAll = () => {
    clearAllNotifications();
  };

  /**
   * Converts a timestamp into a human-readable relative time string.
   * 
   * @param {Date | string} timestamp - The timestamp to format.
   * @returns {string} A string representing time since (e.g., "2h ago", "Mar 15").
   */
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  /**
   * Returns an SVG icon element corresponding to the notification type.
   * 
   * @param {string} type - The type of notification (e.g., "success", "error", "info").
   * @returns {JSX.Element} The icon element representing the type.
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="notification-type-icon success">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="notification-type-icon error">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="notification-type-icon warning">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="notification-type-icon info">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div className="notifications-container">
      <button 
        className="notifications-button" 
        onClick={togglePanel}
        aria-label="Notifications"
        ref={buttonRef}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <NotificationBadge count={unreadCount} />
      </button>
      
      {isOpen && (
        <div className="notifications-panel" ref={panelRef}>
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-actions">
              
              
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read-button"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </button>
              )}
              
              {notifications.length > 0 && (
                <button 
                  className="clear-all-button"
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>
                  <button 
                    className="notification-dismiss"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    aria-label="Dismiss notification"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;
