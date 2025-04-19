"use client"

// src/pages/dashboard/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Review from '../../components/review/Review';
import './Dashboard.css';

function Dashboard() {
  const [userRole, setUserRole] = useState("")
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
    earnings: 0,
    matches: 0,
  })
  const [recentMatches, setRecentMatches] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const [googleEvents, setGoogleEvents] = useState([]);

  useEffect(() => {
    const fetchGoogleEvents = async () => {
      try {
        const res = await fetch('http://localhost/TutorMatch/server/calendar/fetchEvents.php', {
          credentials: 'include',
        });
        const data = await res.json();
  
        if (data.success) {
          setGoogleEvents(data.events); // ✅ Access the 'events' array
        } else {
          console.error("Google Calendar API error:", data.error || "Unknown error");
        }
      } catch (err) {
        console.error('Failed to load calendar events:', err);
      }
    };
  
    fetchGoogleEvents();
  }, []);
  

  useEffect(() => {

    const fetchDashboardData = () => {
      setTimeout(() => {
        // Get user role from localStorage (set during login/role selection)
        const role = localStorage.getItem("userRole") || "tutee"
        setUserRole(role)

        // Mock data based on role
        if (role === "tutor") {
          setStats({
            totalSessions: 24,
            upcomingSessions: 3,
            averageRating: 4.8,
            earnings: 1250,
            matches: 15,
          })

          setRecentMatches([
            {
              id: 1,
              name: "Alex Johnson",
              subject: "Mathematics",
              matchDate: "2023-04-10T14:30:00Z",
              profileImage: "/placeholder-avatar.png",
            },
            {
              id: 2,
              name: "Sarah Williams",
              subject: "Physics",
              matchDate: "2023-04-08T09:15:00Z",
              profileImage: "/placeholder-avatar.png",
            },
            {
              id: 3,
              name: "James Brown",
              subject: "Chemistry",
              matchDate: "2023-04-05T16:45:00Z",
              profileImage: "/placeholder-avatar.png",
            },
          ])
        } else {
          setStats({
            totalSessions: 12,
            upcomingSessions: 2,
            averageRating: 0,
            matches: 5,
            favoriteTutors: 3,
          })

          setRecentMatches([
            {
              id: 1,
              name: "Dr. Michael Chen",
              subject: "Computer Science",
              matchDate: "2023-04-10T14:30:00Z",
              profileImage: "/placeholder-avatar.png",
            },
            {
              id: 2,
              name: "Prof. Emily Johnson",
              subject: "Biology",
              matchDate: "2023-04-08T09:15:00Z",
              profileImage: "/placeholder-avatar.png",
            },
          ])
        }

        // Reviews data (same for both roles)
        setReviews([
          {
            id: 1,
            rating: 5,
            title: "Excellent tutor!",
            body: "Very knowledgeable and patient. Explains complex concepts in an easy-to-understand way.",
            author: "Alex Johnson",
            date: "2023-04-01",
            pfp: "/placeholder-avatar.png",
          },
          {
            id: 2,
            rating: 4,
            title: "Great session",
            body: "Really helped me understand the material. Would recommend!",
            author: "Sarah Williams",
            date: "2023-03-25",
            pfp: "/placeholder-avatar.png",
          },
          {
            id: 3,
            rating: 5,
            title: "Very helpful",
            body: "Excellent at breaking down difficult concepts. I improved my grade significantly.",
            author: "James Brown",
            date: "2023-03-15",
            pfp: "/placeholder-avatar.png",
          },
        ])

        setLoading(false)
      }, 1000)
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Matches</h3>
                <p className="stat-value">{stats.matches}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon favorites">
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
                    <img src={match.profileImage || "/placeholder-avatar.png"} alt={match.name} />
                  </div>
                  <div className="match-details">
                    <h3>{match.name}</h3>
                    <p>{match.subject}</p>
                    <span className="match-date">Matched on {new Date(match.matchDate).toLocaleDateString()}</span>
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
              googleEvents.map((event, index) => (
                <div key={index} className="event">
                  <strong>{event.summary}</strong>
                  <p>{new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No upcoming events found.</p>
            )}
          </div>

        </div>

        <div className="dashboard-card reviews full-width">
          <div className="card-header">
            <h2>Latest Reviews</h2>
            <Link to="/profile" className="view-all">
              View All
            </Link>
          </div>

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Review
                  key={review.id}
                  rating={review.rating}
                  title={review.title}
                  body={review.body}
                  author={review.author}
                  date={review.date}
                  pfp={review.pfp}
                />
              ))
            ) : (
              <div className="no-data">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
