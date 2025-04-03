import React from 'react';
import './NotificationBadge.css';

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