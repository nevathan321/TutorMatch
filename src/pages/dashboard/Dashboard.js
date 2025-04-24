/**
 * Dashboard Component
 * 
 * Date: 2025-04-23
 * Team: WebFusion
 * Team Members: Nevathan, Liyu, Adrian, Abishan
 * 
 * This component handles the display of the user's dashboard, including their recent matches,
 * upcoming sessions, and reviews. It fetches data from the server for matched tutors, Google
 * Calendar events, and allows the user to submit reviews for tutors.
 * 
 * Key Features:
 * - Fetches Google Calendar events and displays upcoming sessions.
 * - Displays recent tutor matches for the user.
 * - Provides a form to submit a review for a tutor.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Review from "../../components/Reviews/CreateReview/Review";
import "./Dashboard.css";

/**
 * Renders the user dashboard component.
 *
 * @param {Object} props
 * @param {Object} props.userProfile - The currently logged-in user's profile data.
 *
 * @returns {JSX.Element} Dashboard view including stats, recent matches, upcoming sessions, and review form.
 */

function Dashboard({userProfile}) {
  const [totalMatches, setTotalMatches] = useState(null)
  const [recentMatches, setRecentMatches] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [googleEvents, setGoogleEvents] = useState([]);

  // New state for review form
  const [newReview, setNewReview] = useState({
    title: "",
    body: "",
    rating: 5,
    tutorId: "", // Add tutorId field
  });

  const [userRole, setUserRole] = useState("tutee"); // Add userRole state
  const [stats, setStats] = useState({
    averageRating: 0,
    earnings: 0,
    favoriteTutors: 0
  }); // Add stats state

  

  // Fetches matched tutors for the user from the server and updates the recent matches and total matches state
  useEffect(() => {
    fetchGoogleEvents();
    fetchMatchedTutors();
    setLoading(false)
  }, []);

  
  /**
   * Fetches events from the Google Calendar API for the logged-in user.
   * Updates the state with a list of upcoming sessions.
   *
   * @async
   * @returns {void}
   */
  const fetchGoogleEvents = async () => {
    try {
      const res = await fetch("https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/calendar/fetchEvents.php",
        {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            senderEmail: localStorage.getItem("userEmail"),
          })
        }
      );
      const data = await res.json();

      if (data.success) {
        setGoogleEvents(data.events);
      } else {
        console.error(
          "Google Calendar API error:",
          data.error || "Unknown error"
        );
      }
    } catch (err) {
      console.error("Failed to load calendar events:", err);
    }
  };

  /**
   * Fetches recent tutor matches from the backend for the current tutee.
   * Updates recent matches and total match count in the component state.
   *
   * @async
   * @returns {void}
   */
  const fetchMatchedTutors = async () => {
    try {
      const response = await fetch(
        `https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/match/getMatches.php?tuteeID=${userProfile.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const matchedTutors = await response.json();
     
      setRecentMatches(matchedTutors.slice(-4));//gets last 4 matches
      setTotalMatches(matchedTutors.length)
  
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  /**
   * Updates the review form state based on input changes.
   *
   * @param {Object} e - The input change event.
   */
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Updates the rating value in the review form when a star is selected.
   *
   * @param {number} rating - The selected star rating (1–5).
   */
  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating,
    }));
  };

  /**
   * Handles review form submission.
   * Builds a new review object, resets the form, updates the local review list,
   * and uploads the review to the server.
   *
   * @param {Object} e - The form submit event.
   * @returns {void}
   */
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const getTutorName = (tutorID) => {
      for (const tutor of recentMatches) {
        if (tutor.id === Number(tutorID)) return tutor.full_name;
      }
    };
    const newReviewObj = {
      authorID: userProfile.id,
      rating: Number.parseInt(newReview.rating),
      title: newReview.title,
      body: newReview.body,
      authorName: userProfile.full_name,
      datePosted: formattedDate,
      tutorID: newReview.tutorId,
      tutorName: getTutorName(newReview.tutorId),
    };

    // Add to reviews list
    setReviews((prev) => [newReviewObj, ...prev]);

    // Reset form
    setNewReview({
      title: "",
      body: "",
      rating: 5,
      tutorId: "",
    });

    /**
     * Sends the newly submitted review to the backend API for database storage.
     * Called after local state is updated with the new review.
     *
     * @param {Object} newReviewObj - The review object containing tutor ID, rating, title, body, and author details.
     * @async
     * @returns {void}
     */
    const uploadReview = async (newReviewObj) => {
      try {
        const response = await fetch(`https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/reviews/createReview.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReviewObj),
        });
  
        //const result = await response.json();
    
      } catch (error) {
        console.error("Error:", error);
      }
    };
    uploadReview(newReviewObj);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p className="dashboard-subtitle">Find tutors and manage your learning journey</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon sessions">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Sessions</h3>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon upcoming">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Upcoming</h3>
            <p className="stat-value">0</p>
          </div>
        </div>

        {userRole === "tutor" ? (
          <>
            <div className="stat-card">
              <div className="stat-icon rating">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">

                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Rating</h3>
                <p className="stat-value">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon earnings">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Earnings</h3>
                <p className="stat-value">${stats.earnings}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon matches">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l3 9h-6l3-9z"></path>
                  <path d="M12 22l3-9h-6l3 9z"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Matches</h3>
                <p className="stat-value">{totalMatches}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon reviews">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"

                  strokeLinejoin="round">

                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Favorites</h3>
                <p className="stat-value">{stats.favoriteTutors || 0}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-matches">
          <div className="card-header">
            <h2>Recent Matches</h2>
            <Link to="/inbox" className="view-all">
              View All
            </Link>
          </div>

          <div className="matches-list">
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div key={match.id} className="match-item">
                  <div className="match-avatar">
                    <img
                      src={match.profileImage || "/placeholder-avatar.png"}
                      alt={match.full_name}
                    />
                  </div>
                  <div className="match-details">

                    <h3>{match.full_name}</h3>
                    <p>{JSON.parse(match.main_subjects)[0]}</p>
                    <span className="match-date">
                      
                      {match.bio}
                    </span>

                  </div>
                  <Link to={`/inbox`} className="contact-button">
                    Contact
                  </Link>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No matches yet. Start browsing tutors!</p>
                <Link to="/match" className="action-link">
                  Find Tutors
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card schedule">
          <div className="card-header">
            <h2>Upcoming Sessions</h2>
          </div>

          <div className="calendar-container">
            {googleEvents.length > 0 ? (
              <ul className="event-list">
                {googleEvents.map((event, index) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);

                  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
                  const timeOptions = { hour: '2-digit', minute: '2-digit' };

                  const formattedDate = start.toLocaleDateString(undefined, dateOptions);
                  const startTime = start.toLocaleTimeString(undefined, timeOptions);
                  const endTime = end.toLocaleTimeString(undefined, timeOptions);

                  return (
                    <li key={index} className="event-item">
                      <div className="event-date">
                        <span className="event-day">{formattedDate} , </span>
                        <span className="event-time-range">{startTime} – {endTime}</span>
                      </div>
                      <div className="event-details">
                        <strong className="event-title">{event.summary}</strong>
                        {event.location && (
                          <p className="event-location">{event.location}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="no-events">No upcoming events found.</p>
            )}
          </div>

        </div>
      </div>

      {/* New Review Form Section - Moved before the reviews section */}
      <div className="dashboard-card create-review full-width">
        <div className="card-header">
          <h2>Write a Review</h2>
        </div>

        <div className="review-form-container">
          <form onSubmit={handleReviewSubmit} className="review-form">
            {/* Add the tutor selection dropdown to the review form */}
            <div className="form-group">
              <label htmlFor="tutorId">Select Tutor</label>
              <select
                id="tutorId"
                name="tutorId"
                value={newReview.tutorId}
                onChange={handleReviewChange}
                className="tutor-select"
                required>
                <option value="">-- Select a Tutor --</option>
                {recentMatches.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.full_name} - {JSON.parse(tutor.main_subjects)[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newReview.title}
                onChange={handleReviewChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="body">Review</label>
              <textarea
                id="body"
                name="body"
                value={newReview.body}
                onChange={handleReviewChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${newReview.rating >= star ? "selected" : ""}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>
        </div>
      </div>

      <div className="review-section">
        <Review
          handleReviewSubmit={handleReviewSubmit}
          handleReviewChange={handleReviewChange}
          handleRatingChange={handleRatingChange}
          newReview={newReview}
          tutors={recentMatches} // Fix: use recentMatches instead of undefined tutors
        />
      </div>
    </div>
  );
}

export default Dashboard;
