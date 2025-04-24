/**
 * ToastContainer Component
 * 
 * Date: 2025-04-24
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * 
 * This component is responsible for rendering all active toast notifications.
 * It pulls toast data from the NotificationContext and renders a `ToastNotification`
 * for each item, allowing individual toasts to be dismissed.
 */


import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import ToastNotification from '../ToastNotification/ToastNotification';
import './ToastContainer.css';

/**
 * Renders a container for toast notifications.
 *
 * Fetches active toasts from the notification context and maps them to individual
 * ToastNotification components, handling their close behavior.
 *
 * @returns {JSX.Element} A container with rendered toast messages.
 */
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