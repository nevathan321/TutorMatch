import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
// Remove direct import of notification sound
// import notificationSound from '../assets/notification-sound.mp3';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Initialize audio only after user interaction
  useEffect(() => {
    // Check if sound preference is stored
    const storedSoundPreference = localStorage.getItem('notificationSoundEnabled');
    if (storedSoundPreference !== null) {
      setSoundEnabled(storedSoundPreference === 'true');
    }
    
    // We'll initialize the audio element but not load the source yet
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
    
    // Cleanup function
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
      // Set the source only after user interaction
      audioRef.current.src = '/notification-sound.mp3'; // Adjust path as needed
      setAudioInitialized(true);
    }
  };
  
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
    
    // Play sound if enabled and audio is initialized
    if (soundEnabled && audioInitialized && audioRef.current) {
      // Reset audio to beginning if it's already playing
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Use a promise to catch any errors
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio playback was prevented by the browser:', error);
        });
      }
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
    // Initialize audio if not already done
    initializeAudio();
    
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
        removeToast,
        initializeAudio // Export this function to be called on user interaction
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};