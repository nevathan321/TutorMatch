import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

// Create a context for notifications
const NotificationContext = createContext();

// Custom hook to access notifications context
export const useNotifications = () => useContext(NotificationContext);

// NotificationProvider component to provide notification functionality
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);  // State for storing notifications
  const [toasts, setToasts] = useState([]);  // State for storing toast notifications
  const [unreadCount, setUnreadCount] = useState(0);  // State for unread notifications count
  const [soundEnabled, setSoundEnabled] = useState(true);  // State for whether sound is enabled
  const audioRef = useRef(null);  // Ref for audio element
  const [audioInitialized, setAudioInitialized] = useState(false);  // State to track if audio is initialized
  
  // Initialize audio only after user interaction and store sound preference
  useEffect(() => {
    const storedSoundPreference = localStorage.getItem('notificationSoundEnabled');
    if (storedSoundPreference !== null) {
      setSoundEnabled(storedSoundPreference === 'true');
    }
    
    // Initialize audio element but do not load the source yet
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Function to initialize audio after user interaction
  const initializeAudio = () => {
    if (!audioInitialized && audioRef.current) {
      audioRef.current.src = '/notification-sound.mp3';  // Set the audio source only after user interaction
      setAudioInitialized(true);
    }
  };
  
  // Update unread notifications count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  // Function to add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play notification sound if enabled and audio is initialized
    if (soundEnabled && audioInitialized && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio playback was prevented by the browser:', error);
        });
      }
    }
    
    // Add the notification as a toast
    addToast(newNotification);
  };
  
  // Function to mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Function to toggle sound settings
  const toggleSound = () => {
    initializeAudio();
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('notificationSoundEnabled', newSoundEnabled.toString());
  };
  
  // Function to add a toast notification
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
  
  // Function to remove a toast notification
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
        removeToast,
        initializeAudio 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
