/**
 * NotificationBadge Component
 * 
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Liyu, Adrian, Abishan
 *
 * This component displays a circular badge with the number of unread notifications.
 * It only renders if the count is greater than zero and shows "9+" for counts above 9.
 */


import React from 'react';
import './NotificationBadge.css';


/**
 * Renders a notification count badge, capped at 9+.
 *
 * @param {Object} props
 * @param {number} props.count - Number of unread notifications to display
 * @returns {JSX.Element|null} A span element showing the count, or null if count is 0 or less
 */

function NotificationBadge({ count }) {
  if (!count || count <= 0) return null;
  
  // Display 9+ if count is greater than 9
  const displayCount = count > 9 ? '9+' : count;
  
  return (
    <span className="notification-badge">
      {displayCount}
    </span>
  );
}

export default NotificationBadge;
