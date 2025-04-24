/**
 * File: Reviews.js
 * Date: 2025-04-24
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 *
 * Description:
 * This file contains the Reviews component, which displays a modal listing 
 * all reviews for a given tutor. It includes:
 * - `fetchReviews`: An asynchronous helper function that retrieves reviews
 *   for a tutor from the backend API.
 * - `Reviews` component: A modal component that loads and renders reviews 
 *   when opened. It shows loading and error states, and formats each review
 *   with title, reviewer name, star rating, and date.
 */


import React, { useState, useEffect } from 'react';
import './reviews.css';
import Modal from '../modal/modal';

/**
 * Fetches reviews for a specific tutor by ID from the server.
 *
 * @param {number|string} tutorId - The ID of the tutor whose reviews are being requested.
 * @returns {Promise<Array>} A promise that resolves to an array of review objects, or an empty array on failure.
 */
export const fetchReviews = async (tutorId) => {
    try {
        const response = await fetch(
            `https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/reviews/getReviews.php?tutorID=${tutorId}`,
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
