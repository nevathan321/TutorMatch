import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import ToastNotification from '../ToastNotification/ToastNotification';
import './ToastContainer.css';

function ToastContainer() {
  const { toasts, removeToast } = useNotifications();
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastNotification 
          key={toast.id} 
          notification={toast} 
          onClose={removeToast} 
        />
      ))}
    </div>
  );
}

export default ToastContainer;