// src/pages/dashboard/Dashboard.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Review from "../../components/review/Review";
import "./Dashboard.css";

function Dashboard({ userProfile }) {
  const [userRole, setUserRole] = useState("");

  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
    earnings: 0,
    matches: 0,
  });

  const [totalMatches, setTotalMatches] = useState(null);
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

  // Add state for tutors list
  const [tutors, setTutors] = useState([]);

  // Fetches events from the Google Calendar API and updates the state with the event data
  useEffect(() => {
    const fetchGoogleEvents = async () => {
      try {
        const res = await fetch(
          "http://localhost/TutorMatch/server/calendar/fetchEvents.php",
          {
            credentials: "include",
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

    fetchGoogleEvents();
  }, []);

  // Fetches matched tutors for the user from the server and updates the recent matches and total matches state
  useEffect(() => {
    const fetchMatchedTutors = async () => {
      try {
        const response = await fetch(
          `http://localhost/tutorMatch/server/match/getMatches.php?tuteeID=${userProfile.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const matchedTutors = await response.json();

        setRecentMatches(matchedTutors.slice(-4)); // gets last 4 matches
        setTotalMatches(matchedTutors.length);
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    fetchMatchedTutors();
    setLoading(false);
  }, []);

  // Updates the review form state when any field is changed
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Updates the rating in the review form when a star is selected
  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating,
    }));
  };

  // Handles the submission of the new review, including resetting the form and uploading the review to the server
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

    // Uploads the review to the server
    const uploadReview = async (newReviewObj) => {
      try {
        const response = await fetch(
          `http://localhost/tutorMatch/server/reviews/createReview.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReviewObj),
          }
        );
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
        <p className="dashboard-subtitle">
          {userRole === "tutor"
            ? "Manage your tutoring sessions and track your progress"
            : "Find tutors and manage your learning journey"}
        </p>
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
            <p className="stat-value">{stats.totalSessions}</p>
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
            <p className="stat-value">{stats.upcomingSessions}</p>
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
                  strokeLinejoin="round"
                >
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
                  strokeLinejoin="round"
                >
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
                  strokeLinejoin="round"
                >
                  <path d="M12 1v22m6-6v6H6v-6"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Reviews</h3>
                <p className="stat-value">{reviews.length}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="recent-matches">
        <h3>Recent Matches</h3>
        <div className="matches-list">
          {recentMatches.map((match) => (
            <div className="match-card" key={match.id}>
              <h4>{match.full_name}</h4>
              <Link to={`/tutor/${match.id}`} className="view-profile">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="review-section">
        <Review
          handleReviewSubmit={handleReviewSubmit}
          handleReviewChange={handleReviewChange}
          handleRatingChange={handleRatingChange}
          newReview={newReview}
          tutors={tutors}
        />
      </div>
    </div>
  );
}

export default Dashboard;
