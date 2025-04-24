/* 
GroupName: WebFusion 
GroupMembers: Nevathan, Adrian, Liyu, Abishan
Date: 2025-04-23

Description: This file contains the TutorCard component which displays a tutor's 
information such as their name, subjects, hourly wage, education, and rating. It 
fetches the latest review for the tutor and renders it along with star ratings. 
The component also includes buttons to accept or reject the tutor and shows 
a modal with more reviews when clicked. The getYearOfStudyString function is 
used to display the tutor's academic year in a user-friendly format, and 
subject-specific CSS classes are applied to differentiate subjects. 
The Reviews component is used to show additional reviews in a modal dialog. 
*/


import { useState, useEffect } from "react";
import './TutorCard.css';
import Reviews from '../Reviews/reviews';
import { fetchReviews } from '../Reviews/reviews';

// Function to return the year of study string based on the year number
const getYearOfStudyString = (year) => {
  switch (year) {
    case 1:
      return "1st Year";
    case 2:
      return "2nd Year";
    case 3:
      return "3rd Year";
    case 4:
      return "4th Year";
    case 5:
      return "5th Year";
    default:
      return "N/A";
  }
};

const review = {
  title: 'AMAZING',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.',
  reviewerName: 'Ashley',
  reviewerImage: '/placeholder-avatar.png',
  date: 'March 23, 2024'
}

function TutorCard({ tutor, onSeeMoreReviews, onAccept, onReject }) {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [latestReview, setLatestReview] = useState(null);
  const subjects = JSON.parse(tutor.main_subjects)

  useEffect(() => {
      const getLatestReview = async () => {
          const reviews = await fetchReviews(tutor.id);
          if (reviews && reviews.length > 0) {
              setLatestReview(reviews[0]); // Get the first (latest) review
          }
      };

      getLatestReview();
  }, [tutor.id]);
 
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          {i <= rating ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </span>
      );
    }
    return stars;
  };
  
  const getSubjectClass = (subject) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('chemistry')) return 'chemistry';
    if (subjectLower.includes('physics')) return 'physics';
    if (subjectLower.includes('math')) return 'mathematics';
    if (subjectLower.includes('program') || subjectLower.includes('computer')) return 'programming';
    if (subjectLower.includes('stat')) return 'statistics';
    return '';
  };
  
  return (
    <div className="tutor-card">
      <div className="tutor-info">
        <div className="tutor-image-container">
          <img 
            src={'/placeholder-tutor.png'} 
            alt={`Tutor ${tutor.full_name}`} 
            className="tutor-image"
          />
        </div>
        
        <div className="tutor-details">
          <h2 className="tutor-name">{tutor.full_name}</h2>
          
          <div className="tutor-subjects">
            {subjects.map((subject, index) => (
              <span 
                key={index} 
                className={`subject-tag ${getSubjectClass(subject)}`}
              >
                {subject}
              </span>
            ))}
          </div>
          
          <div className="tutor-price">${tutor.wage}/Hr</div>
          
          <div className="tutor-education">{tutor.major} - {getYearOfStudyString(tutor.year_of_study)}</div>
          
          <button 
            className="see-more-button"
            onClick={() => setShowReviewsModal(true)}
          >
            See More Reviews
          </button>
          
          <div className="tutor-rating">
            {renderStars(tutor.rating)}
          </div>
          
          {latestReview && (
                <div className="review-section">
                    <div className="review-title">{latestReview.title}</div>
                    <p className="review-text">{latestReview.review_text || latestReview.body}</p>
                    
                    <div className="reviewer-info">
                        <img 
                            src="/placeholder-avatar.png"
                            alt={latestReview.reviewer_name} 
                            className="reviewer-image"
                        />
                        <span className="reviewer-name">{latestReview.reviewer_name}</span>
                        <span className="review-date">
                            {new Date(latestReview.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )}
            
          
          <div className="tutor-actions">
            <button 
              className="action-button reject" 
              onClick={onReject}
              aria-label="Reject tutor"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Reject</span>
            </button>
            
            <button 
              className="action-button accept" 
              onClick={onAccept}
              aria-label="Accept tutor"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Accept</span>
            </button>
          </div>

          <Reviews 
                isOpen={showReviewsModal}
                onClose={() => setShowReviewsModal(false)}
                tutor={tutor}
          />
          
        </div>
      </div>
    </div>
  );
}

export default TutorCard;

