/* 
  ToastNotification Component
  Date: 2025-04-24
  Designed by WebFusion (Nevathan, Liyu, Adrian, Abishan)
  Displays toast notifications with different types (success, error, warning, info)
  Automatically disappears after 5 seconds with an exit animation, can be manually closed
*/

import React, { useState, useEffect } from 'react';
import './ToastNotification.css';


/**
 * Renders an individual toast notification.
 *
 * @param {Object} notification - The notification data object.
 * @param {string} notification.id - Unique ID of the notification.
 * @param {string} notification.type - Type of the notification (success, error, warning, info).
 * @param {string} notification.title - Title text of the notification.
 * @param {string} notification.message - Body message of the notification.
 * @param {Function} onClose - Callback function to remove the toast.
 *
 * @returns {JSX.Element} A styled toast notification component with auto-dismiss and close functionality.
 */

function ToastNotification({ notification, onClose }) {
  // State to track if the toast is exiting
  const [isExiting, setIsExiting] = useState(false);

  /**
   * Sets up timers for triggering the exit animation and removing the toast after 5 seconds.
   *
   * @effect Runs once when the component mounts or when notification.id changes
   */
  useEffect(() => {
    // Set timer for exit animation after 4.5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 4500); // Start exit animation after 4.5 seconds
    
    // Remove toast after 5 seconds
    const closeTimer = setTimeout(() => {
      onClose(notification.id);
    }, 5000); // Remove after 5 seconds
    
    return () => {
      // Cleanup timers on unmount or change in notification.id
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [notification.id, onClose]);
  
  /**
   * Handles manual closing of the toast when the user clicks the close button.
   *
   * @param {Event} e - Click event
   */
  const handleClose = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Wait for exit animation to complete
  };
  
  /**
   * Returns the CSS class corresponding to the toast notification type.
   *
   * @returns {String} - A class string: 'toast-success', 'toast-error', etc.
   */
  const getTypeClass = () => {
    switch (notification.type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  };

  /**
   * Returns the appropriate SVG icon element based on the toast type.
   *
   * @returns {JSX.Element} - The SVG icon element
   */
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };
  
  return (
    <div className={`toast-notification ${getTypeClass()} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <div className="toast-title">{notification.title}</div>
        <div className="toast-message">{notification.message}</div>
      </div>
      <button 
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}

export default ToastNotification;
