import React from 'react';
import './NotificationBadge.css';

// Component that displays a notification badge if count is greater than 0
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
