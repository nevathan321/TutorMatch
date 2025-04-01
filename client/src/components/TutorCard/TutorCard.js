/*js change*/

import React from 'react';
import './TutorCard.css';

function TutorCard({ tutor, onSeeMoreReviews }) {
  // Destructure tutor properties
  const { 
    name, 
    subjects, 
    priceRange, 
    education, 
    rating, 
    review 
  } = tutor;

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="tutor-card">
      <div className="tutor-image-container">
        <div className="tutor-image">
          {/* Replace with actual tutor image */}
          <img 
            src={tutor.image || '/placeholder-tutor.png'} 
            alt={name} 
          />
        </div>
      </div>
      
      <div className="tutor-info">
        <h2 className="tutor-name">{name}</h2>
        
        <div className="tutor-subjects">
          {subjects.map((subject, index) => (
            <span key={index} className="subject-tag">
              {subject}
            </span>
          ))}
        </div>
        
        <div className="tutor-price">{priceRange}</div>
        
        <p className="tutor-education">{education}</p>
        
        <button 
          className="see-reviews-btn"
          onClick={onSeeMoreReviews}
        >
          See More Reviews
        </button>
        
        <div className="rating-stars">
          {renderStars()}
        </div>
        
        {review && (
          <div className="review-section">
            <h3 className="review-title">{review.title}</h3>
            <p className="review-text">{review.text}</p>
            
            <div className="reviewer-info">
              <div className="reviewer-avatar">
                <img 
                  src={review.reviewerImage || '/placeholder-avatar.png'} 
                  alt={review.reviewerName} 
                />
              </div>
              <div className="reviewer-details">
                <p className="reviewer-name">{review.reviewerName}</p>
                <p className="review-date">{review.date}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorCard;