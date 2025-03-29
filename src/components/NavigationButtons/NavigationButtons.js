/*js change*/

import React from 'react';
import './NavigationButtons.css';

function NavigationButtons({ onPrevious, onNext }) {
  return (
    <div className="navigation-buttons">
      <button 
        className="nav-button previous" 
        onClick={onPrevious}
        aria-label="Previous tutor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <button 
        className="nav-button next" 
        onClick={onNext}
        aria-label="Next tutor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}

export default NavigationButtons;