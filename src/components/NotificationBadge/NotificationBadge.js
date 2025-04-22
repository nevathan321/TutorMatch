import React from 'react';
import './NotificationBadge.css';


// This component displays a small badge showing the number of notifications
function NotificationBadge({ count, maxCount = 99, className = '' }) {
  if (!count || count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  return (
    <div className={`notification-badge ${className}`}>
      {displayCount}
    </div>
  );
}

export default NotificationBadge;