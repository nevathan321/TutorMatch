import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import ToastNotification from '../ToastNotification/ToastNotification';
import './ToastContainer.css';

function ToastContainer() {

  // Destructure toasts and removeToast from context
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