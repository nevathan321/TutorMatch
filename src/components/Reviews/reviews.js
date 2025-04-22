import React, { useState, useEffect } from 'react';
import './reviews.css';
import Modal from '../modal/modal';

export const fetchReviews = async (tutorId) => {
    try {
        const response = await fetch(
            `http://localhost/TutorMatch/server/reviews/getReviews.php?tutorID=${tutorId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const reviewsData = await response.json();
        return reviewsData;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};


const Reviews = ({ isOpen, onClose, tutor }) => {
    
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReviews = async () => {
            if (!tutor?.id || !isOpen) return;
            
            setIsLoading(true);
            setError(null);
            
            const reviewsData = await fetchReviews(tutor.id);
            setReviews(reviewsData);
            setIsLoading(false);
        };

        loadReviews();
    }, [tutor?.id, isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Reviews for ${tutor?.full_name}`}
        >
            <div className="reviews-container">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <div className="review-title">{review.title}</div>
                                <span className="reviewer-name">{review.reviewer_name || 'Anonymous'}</span>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? "star filled" : "star"}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="review-date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="review-content">
                                <p>{review.review_text || review.body}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        <p>No reviews available for this tutor yet.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default Reviews;