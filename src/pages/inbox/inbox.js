/**
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Liyu, Adrian, Abishan
 *
 * Description:
 * This component renders the Inbox page for TutorMatch. It allows users to:
 * - Fetch and view matched tutors
 * - Search tutors by name
 * - Email tutors through Gmail API
 * - Schedule sessions via Google Calendar
 * 
 * It also supports authentication redirection and shows real-time status messages.
 */

"use client";

// src/pages/inbox/inbox.js
import { useState, useEffect } from "react";
import "./inbox.css";
import MyCalendar from "../../components/calendar/MyCalendar";
import Modal from "../../components/modal/modal";
import Reviews from "../../components/Reviews/reviews";


/**
 * Renders the inbox view with matched tutors.
 *
 * @param {Object} props
 * @param {Object} props.userProfile - The profile of the currently logged-in user.
 *
 * @returns {JSX.Element} Inbox page with search, email, calendar invite, and review modal functionality.
 */

function Inbox({ userProfile }) {
    // State variables for managing data and UI

    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [emailContent, setEmailContent] = useState({ subject: "", message: "" });
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailStatus, setEmailStatus] = useState({ type: "", message: "" });

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarTutor, setCalendarTutor] = useState(null);

    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("11:00");

    const [showReviewsModal, setShowReviewsModal] = useState(false);


    useEffect(() => {
        fetchMatchedTutors();
    }, []);


    /**
     * Fetches tutor matches for the current user from the backend.
     * Filters the matches based on the current search term.
     *
     * @async
     * @effect Runs on component mount and when searchTerm or user ID changes.
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

            // Error handling for failed response

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const matchedTutors = await response.json();
            console.log("Fetched matches:", matchedTutors); // Debugging
            setMatches(matchedTutors);
            setFilteredMatches(matchedTutors.filter((match) =>
                match.full_name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } catch (err) {
            console.error("Error fetching matches:", err);
            setMatches([]);
            setFilteredMatches([]);
        }
    };

    /**
     * Returns the academic year label based on the numerical value.
     *
     * @param {number} year - The academic year as a number.
     * @returns {string} - The corresponding year label (e.g., "1st Year").
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
     * Updates the searchTerm state and filters tutor matches accordingly.
     *
     * @param {Object} e - The input change event.
     */
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setFilteredMatches(matches.filter((match) =>
            match.full_name.toLowerCase().includes(e.target.value.toLowerCase())
        ));
    };

    /**
     * Handles selecting a tutor for email or calendar interaction.
     * Sets the selected tutor and prepares a default email message.
     *
     * @param {Object} tutor - The selected tutor's information.
     */
    const handleSelectTutor = (tutor) => {
        setSelectedTutor(tutor);
        const subjects = tutor.main_subjects && typeof tutor.main_subjects === 'string'
            ? JSON.parse(tutor.main_subjects)
            : [];
        setEmailContent({
            subject: `TutorMatch: Session with ${tutor.full_name}`,
            message: `Hi ${tutor.full_name},\n\nI'd like to schedule a tutoring session with you for ${subjects[0] || 'a subject'}.\n\nBest regards,\n[Your Name]`,
        });
        setShowEmailModal(true);
    };

    /**
     * Sends a Google Calendar event invitation to the selected tutor.
     * If not authenticated, opens Google OAuth in a new tab and retries.
     *
     * @param {Object} tutor - Tutor object containing email and name.
     * @param {Date} date - Selected session date.
     * @param {string} startTimeStr - Start time string (e.g., "10:00").
     * @param {string} endTimeStr - End time string (e.g., "11:00").
     * @returns {Promise<Object>} - Result object with success status and event link.
     */
    const sendCalendarInvite = async (tutor, date, startTimeStr, endTimeStr) => {
        try {
            const startDateTime = new Date(date);
            const [startHours, startMinutes] = startTimeStr.split(':');
            startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

            const endDateTime = new Date(date);
            const [endHours, endMinutes] = endTimeStr.split(':');
            endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

            const subjectsArray = tutor.main_subjects && typeof tutor.main_subjects === 'string'
                ? JSON.parse(tutor.main_subjects)
                : [];
            const description = `Tutoring session for ${subjectsArray.join(', ') || 'Unknown Subjects'}`;


            const response = await fetch('https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/calendar/calendar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    tutorEmail: tutor.email,
                    senderEmail: localStorage.getItem("userEmail"),
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    summary: `Tutoring Session with ${tutor.full_name}`,
                    description: description,
                    tutorName: tutor.full_name
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                return { success: true, eventLink: result.eventLink };
            } else if (result.redirect) {
                const authWindow = window.open(
                    "https://cs.1xd3.mcmaster.ca/~xiaol31/TutorMatch/server/authenticate.php",
                    "googleAuth",
                    "width=600,height=600"
                );

                return new Promise((resolve) => {
                    const checkAuthWindow = setInterval(() => {
                        if (authWindow.closed) {
                            clearInterval(checkAuthWindow);
                            setTimeout(async () => {
                                const retryResult = await sendCalendarInvite(tutor, date, startTimeStr, endTimeStr);
                                resolve(retryResult);
                            }, 1000);
                        }
                    }, 500);
                });
            } else {
                return { success: false, error: result.error || 'Failed to schedule session' };
            }
        } catch (error) {
            console.error('Error sending calendar invite:', error);
            return { success: false, error: error.message };
        }
    };

    /**
     * Sends an email to the selected tutor via Gmail API.
     * Handles token refresh and redirects to authentication if required.
     *
     * @async
     * @returns {void}
     */
    const handleSendEmail = async () => {
        setEmailStatus({ type: "loading", message: "Sending email..." });
      
        try {
          const emailEndpoint = "https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/email/email.php";
      
          const response = await fetch(emailEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              to: selectedTutor.email,
              subject: emailContent.subject,
              message: emailContent.message,
              from: localStorage.getItem("userEmail"),
            }),
          });
      
          const result = await response.json();
      
      
          if (result.success) {
            setEmailStatus({ type: "success", message: "Email sent successfully!" });
            setTimeout(() => {
              setShowEmailModal(false);
              setEmailStatus({ type: "", message: "" });
            }, 2000);
          }
        } catch (error) {
          console.error("Error sending email:", error);
          setEmailStatus({
            type: "error",
            message: "An error occurred while sending the email.",
          });
        }
      };
   


    return (
        <div className="inbox-container">
            <div className="inbox-header">
                <h1>Your Matches</h1>
                <p className="inbox-subtitle">Connect with your matched tutors</p>
            </div>

            <div className="search-container">
                <div className="search-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tutors by name"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="matches-count">
                <h2>{filteredMatches.length} Matched Tutors</h2>
            </div>

            <div className="matches-grid">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <div key={match.id} className="tutor-match-card">
                            <div className="match-header">
                                <div className="match-date">
                                    Matched
                                </div>
                                {match.unread && <div className="unread-badge">New</div>}
                            </div>

                            <div className="tutor-info">
                                <div className="tutor-image">
                                    <img src={match.profile_image || "/placeholder-avatar.png"} alt={match.full_name} />
                                </div>
                                <div className="tutor-details">
                                    <h3>{match.full_name}</h3>
                                    <div className="tutor-subjects">
                                        {match.main_subjects && typeof match.main_subjects === 'string'
                                            ? (JSON.parse(match.main_subjects).map((subject, index) => (
                                                <span key={index} className="subject-tag">{subject}</span>
                                            )))
                                            : (<span className="subject-tag">No Subjects</span>)
                                        }
                                    </div>
                                    <div className="tutor-rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < Math.floor(match.rating) ? "star filled" : "star"}>★</span>
                                            ))}
                                        </div>
                                        <span className="rating-value">{match.rating ? parseFloat(match.rating).toFixed(1) : 'N/A'}</span>
                                    </div>
                                    <div className="tutor-education">{match.major} - {getYearOfStudyString(match.year_of_study)}</div>
                                    <div className="tutor-rate">${match.wage}/hour</div>
                                </div>
                            </div>

                            <div className="tutor-review">
                                <button onClick={() => {
                                    setSelectedTutor(match);
                                    setShowReviewsModal(true);
                                }}>
                                    See Reviews
                                </button>
                            </div>


                            <div className="match-actions">
                                <button className="action-button primary" onClick={() => handleSelectTutor(match)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    Email
                                </button>
                                <button className="action-button secondary" onClick={() => {
                                    setCalendarTutor(match);
                                    setShowCalendarModal(true);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    Schedule
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-matches">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="8" y1="15" x2="16" y2="15"></line>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                        <p>No matches found.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                title={`Email ${selectedTutor?.full_name}`}
                footer={
                    <>
                        <button
                            className="cancel-button"
                            onClick={() => setShowEmailModal(false)}
                            disabled={emailStatus.type === "loading"}
                        >
                            Cancel
                        </button>
                        <button
                            className="send-button"
                            onClick={handleSendEmail}
                            disabled={emailStatus.type === "loading"}
                        >
                            Send Email
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label htmlFor="email-subject">Subject</label>
                    <input
                        type="text"
                        id="email-subject"
                        value={emailContent.subject}
                        onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email-message">Message</label>
                    <textarea
                        id="email-message"
                        rows="8"
                        value={emailContent.message}
                        onChange={(e) => setEmailContent({ ...emailContent, message: e.target.value })}
                    ></textarea>
                </div>
                {emailStatus.message && (
                    <div className={`email-status ${emailStatus.type}`}>
                        {emailStatus.message}
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={showCalendarModal}
                onClose={() => setShowCalendarModal(false)}
                title={`Schedule with ${calendarTutor?.full_name}`}
                footer={
                    <>
                        <button className="cancel-button" onClick={() => setShowCalendarModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="send-button"
                            onClick={async () => {
                                const result = await sendCalendarInvite(calendarTutor, selectedDate, startTime, endTime);
                                if (result && result.success) {
                                    setEmailStatus({ type: "success", message: "Calendar invite sent!" });
                                    setTimeout(() => {
                                        setShowCalendarModal(false);
                                        setEmailStatus({ type: "", message: "" });
                                    }, 2000);
                                } else {
                                    setEmailStatus({ type: "error", message: result?.error || "Failed to send calendar invite" });
                                }
                            }}
                        >
                            Send Calendar Invite
                        </button>
                    </>
                }
            > 

            <label style={{ textAlign: "center" }}>Select a date:</label>
                <MyCalendar
                    selectedDate={selectedDate}
                    onDateChange={(date) => setSelectedDate(date)}
                    context="modal"
                />
                    <div className="time-selection">
                        <div className="form-group">
                            <label htmlFor="start-time">Start Time:</label>
                            <input
                                type="time"
                                id="start-time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end-time">End Time:</label>
                            <input
                                type="time"
                                id="end-time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                {emailStatus.message && (
                    <div className={`email-status ${emailStatus.type}`}>
                        {emailStatus.message}
                    </div>
                )}
            </Modal>

            <Reviews 
                isOpen={showReviewsModal}
                onClose={() => setShowReviewsModal(false)}
                tutor={selectedTutor}
            />
        </div>
    );
}

export default Inbox;
