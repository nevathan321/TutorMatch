/**
 * GroupName: WebFusion 
 * GroupMembers: Nevathan, Adrian, Liyu, Abishan
 * Date: 2025-04-23
 *
 * This file contains the TutorCard component which displays a tutor's 
 * information such as their name, subjects, hourly wage, education, and rating. 
 * It fetches the latest review for the tutor and renders it along with star ratings. 
 * The component also includes buttons to accept or reject the tutor and shows 
 * a modal with more reviews when clicked.
 */



import { useState, useEffect } from "react";
import './TutorCard.css';
import Reviews from '../Reviews/reviews';
import { fetchReviews } from '../Reviews/reviews';

/**
 * Renders a card component for a given tutor, including their subjects, wage,
 * education, rating, latest review, and buttons to accept or reject them.
 *
 * @param {Object} tutor - The tutor object containing data like name, subjects, wage, etc.
 * @param {Function} onAccept - Callback when the user accepts the tutor.
 * @param {Function} onReject - Callback when the user rejects the tutor.
 *
 * @returns {JSX.Element} A formatted card displaying tutor details and interaction buttons.
 */
function TutorCard({ tutor, onAccept, onReject }) {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [latestReview, setLatestReview] = useState(null);
  const subjects = JSON.parse(tutor.main_subjects)

  /**
   * Fetches the latest review for the current tutor
   * 
   * @effect Runs whenever tutor ID changes
   */
  useEffect(() => {
      getLatestReview();
  }, [tutor.id]);


  /**
   * Gets the latest review from the backend and updates component state
   * 
   * @async
   * @returns {Promise<void>} - Updates the latestReview state
   */
  const getLatestReview = async () => {
    const reviews = await fetchReviews(tutor.id);
    if (reviews && reviews.length > 0) {
        setLatestReview(reviews[0]); // Get the first (latest) review
    }
  };

  /**
   * Converts a numeric academic year to a readable string format
   * 
   * @param {Number} year - Academic year (1 to 5)
   * @returns {String} - Corresponding year string ("1st Year", etc.)
   */
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


  /**
   * Renders a set of star icons based on the tutor's rating
   * 
   * @param {Number} rating - Rating value from 1 to 5
   * @returns {JSX.Element[]} - Array of SVG stars (filled or outlined)
   */
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
  

  /**
   * Returns a CSS class name for styling based on the subject category
   * 
   * @param {String} subject - Name of the subject
   * @returns {String} - CSS class name (e.g., 'chemistry', 'math')
   */
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

