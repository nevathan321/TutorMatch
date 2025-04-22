import React from 'react';
import './NavigationButtons.css';


// Renders two navigation buttons: one for rejecting and one for accepting
function NavigationButtons({ onReject, onAccept }) {
  return (
    <div className="navigation-buttons">
      <button 
        className="nav-button reject" 
        onClick={onReject}
        aria-label="Reject tutor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <button 
        className="nav-button accept" 
        onClick={onAccept}
        aria-label="Accept tutor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  );
}

export default NavigationButtons;