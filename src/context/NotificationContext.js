import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
const notificationSound = new Audio(process.env.PUBLIC_URL + '/notification-sound.mp3');
notificationSound.play();


const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.5;
    
    // Check if sound preference is stored
    const storedSoundPreference = localStorage.getItem('notificationSoundEnabled');
    if (storedSoundPreference !== null) {
      setSoundEnabled(storedSoundPreference === 'true');
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  // Add a notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      // Reset audio to beginning if it's already playing
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
    
    // Also add as toast
    addToast(newNotification);
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
  
  // Toggle sound
  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('notificationSoundEnabled', newSoundEnabled.toString());
  };
  
  // Add a toast notification
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
  
  // Remove a toast notification
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        toggleSound,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};