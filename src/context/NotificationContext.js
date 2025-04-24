/* 
GroupName: WebFusion 
GroupMembers: Nevathan, Adrian, Liyu, Abishan
Date: 2025-04-23

Description: This file provides a NotificationContext and related functionality 
to manage notifications and toast alerts in a React application. The NotificationProvider 
component manages the state for notifications, unread counts, and sound preferences, 
while offering methods to add, remove, mark as read, and clear notifications. It also 
handles the playback of notification sounds based on user preferences and interacts 
with local storage to persist the sound setting. Additionally, the file provides a 
custom hook (useNotifications) to access and manipulate notifications within other 
components of the application.
*/


import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

// Custom hook to access notifications context
export const useNotifications = () => useContext(NotificationContext);


/**
 * Provides global notification context to the application.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 *
 * @returns {JSX.Element} Notification context provider wrapping all children components.
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  /**
   * Adds a new notification to the list and triggers a toast and optional sound.
   *
   * @param {Object} notification - The notification object (title, message, type).
   * @returns {void}
   */
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);


    addToast(newNotification);
  };
  
  /**
   * Marks a single notification as read.
   *
   * @param {string} id - The ID of the notification to mark as read.
   * @returns {void}
   */

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  /**
   * Marks all notifications as read.
   *
   * @returns {void}
   */

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  /**
    * Removes a specific notification from the list.
    *
    * @param {string} id - The ID of the notification to remove.
    * @returns {void}
    */
  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  /**
   * Clears all stored notifications.
   *
   * @returns {void}
   */
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  

  /**
   * Adds a new toast notification to the UI.
   *
   * @param {Object} notification - The notification to convert into a toast.
   * @returns {void}
   */
  const addToast = (notification) => {
    const toast = {
      id: notification.id || Date.now().toString(),
      type: notification.type || 'info',
      title: notification.title || '',
      message: notification.message || '',
      autoClose: true,
      autoCloseDuration: 5000
    };

    setToasts(prev => [...prev, toast]);
  };

  /**
   * Removes a toast by ID.
   *
   * @param {string} id - The ID of the toast to remove.
   * @returns {void}
   */

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
