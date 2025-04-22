import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context for notifications
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

// Sample initial notifications for demonstration
const initialNotifications = [
  {
    id: 1,
    title: 'Welcome to TutorMatch!',
    message: 'Find your perfect tutor match today.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    type: 'info'
  },
  {
    id: 2,
    title: 'Complete Your Profile',
    message: 'Add your subjects and availability to get better matches.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    type: 'info'
  }
];


// Provider component for notification context
export const NotificationProvider = ({ children }) => {
  // Load notifications from localStorage if available
  const savedNotifications = localStorage.getItem('tutorMatchNotifications');

  // Initialize state with saved or default notifications
  const [notifications, setNotifications] = useState(
    savedNotifications ? JSON.parse(savedNotifications) : initialNotifications
  );
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Update unread count whenever notifications change
  useEffect(() => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
    
    // Save notifications to localStorage
    localStorage.setItem('tutorMatchNotifications', JSON.stringify(notifications));
  }, [notifications]);
  
   // Function to add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    

    // Update state with the new notification
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play notification sound if available
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Audio not supported:', error);
    }
    
    return newNotification.id; 
  };
  
  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
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
        getNotificationsByType
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};