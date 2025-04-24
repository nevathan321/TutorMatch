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


import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const NotificationContext = createContext();

// Custom hook to access notifications context
export const useNotifications = () => useContext(NotificationContext);

// Provides notification functionality to the application
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    const storedSoundPreference = localStorage.getItem('notificationSoundEnabled');
    if (storedSoundPreference !== null) {
      setSoundEnabled(storedSoundPreference === 'true');
    }

    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Initializes audio after user interaction
  const initializeAudio = () => {
    if (!audioInitialized && audioRef.current) {
      audioRef.current.src = '/notification-sound.mp3';
      setAudioInitialized(true);
    }
  };

  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Adds a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

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

    addToast(newNotification);
  };

  // Marks a specific notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Marks all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Removes a specific notification
  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  // Clears all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Toggles the sound setting
  const toggleSound = () => {
    initializeAudio();
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('notificationSoundEnabled', newSoundEnabled.toString());
  };

  // Adds a toast notification
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

  // Removes a toast notification
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
