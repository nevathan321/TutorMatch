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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button 
        className="nav-button accept" 
        onClick={onAccept}
        aria-label="Accept tutor"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

export default NavigationButtons;