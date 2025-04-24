/**
 * File: NavigationButtons.js
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * This file defines the NavigationButtons component used within tutor match cards.
 * It renders two circular SVG-based buttons for accepting or rejecting a tutor.
 * These buttons trigger callback functions passed as props from the parent component.
 */

import React from 'react';
import './NavigationButtons.css';


/**
 * Renders navigation buttons for accepting or rejecting a tutor.
 *
 * @param {Function} onReject - Callback triggered when the reject button is clicked.
 * @param {Function} onAccept - Callback triggered when the accept button is clicked.
 * @returns {JSX.Element} A component containing accept and reject buttons.
 */
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