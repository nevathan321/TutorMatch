import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import ToastNotification from '../ToastNotification/ToastNotification';
import './ToastContainer.css';

function ToastContainer() {
  const { notifications, removeNotification } = useNotifications();
  

  // Filters notifications that have a valid type and limits to the first 5 notifications.
  const toastNotifications = notifications
    .filter(notification => notification.type)
    .slice(0, 5);
  
  return (
    <div className="toast-container">
      {toastNotifications.map(notification => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}

export default ToastContainer;