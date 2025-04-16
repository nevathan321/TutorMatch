// src/pages/inbox/inbox.js
import React, { useState, useEffect } from "react";
import Card from "../../components/card/card";
import "./inbox.css";

import MyCalendar from "../../components/calendar/MyCalendar";



function Inbox() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [emailContent, setEmailContent] = useState({ subject: "", message: "" });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ type: "", message: "" });

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarTutor, setCalendarTutor] = useState(null);

  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTutor, setChatTutor] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);



  // Fetch matched tutors
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // In a real app, this would fetch data from your backend
        // For example: const response = await fetch('/api/matches');
        // And you would integrate with your match system
        
        // For now, we'll use mock data to simulate matched tutors
        const mockMatches = [
          {
            id: 1,
            name: "John Smith",
            email: "adrianciepli@gmail.com",
            subjects: ["Mathematics", "Physics"],
            rating: 4.8,
            hourlyRate: 45,
            education: "PhD in Physics, Stanford University",
            bio: "Experienced tutor with 5+ years of teaching experience. Specializing in advanced mathematics and physics.",
            profileImage: "/placeholder-avatar.png",
            matchDate: "2023-04-10T14:30:00Z",
            lastMessage: "Looking forward to our session tomorrow!",
            unread: true
          },
          {
            id: 2,
            name: "Emily Johnson",
            email: "nevathan321@gmail.com",
            subjects: ["Chemistry", "Biology"],
            rating: 4.9,
            hourlyRate: 50,
            education: "MSc in Biochemistry, MIT",
            bio: "Passionate about making science accessible to everyone. I focus on practical applications and real-world examples.",
            profileImage: "/placeholder-avatar.png",
            matchDate: "2023-04-08T09:15:00Z",
            lastMessage: "I've sent you the study materials for our next session.",
            unread: false
          },
          {
            id: 3,
            name: "Michael Chen",
            email: "liyuxiao2@gmail.com",
            subjects: ["Computer Science", "Mathematics"],
            rating: 4.7,
            hourlyRate: 55,
            education: "BSc in Computer Science, UC Berkeley",
            bio: "Software engineer by day, tutor by night. I specialize in programming, algorithms, and discrete mathematics.",
            profileImage: "/placeholder-avatar.png",
            matchDate: "2023-04-05T16:45:00Z",
            lastMessage: "Great progress today! Let's continue with algorithms next time.",
            unread: false
          },
          {
            id: 4,
            name: "Sarah Williams",
            email: "liyuxiao2@gmail.com",
            subjects: ["English Literature", "History"],
            rating: 4.6,
            hourlyRate: 40,
            education: "MA in English Literature, Columbia University",
            bio: "Helping students develop critical thinking skills through literature and history. Specializing in essay writing and analysis.",
            profileImage: "/placeholder-avatar.png",
            matchDate: "2023-04-03T11:20:00Z",
            lastMessage: "Your essay draft looks great! Let's discuss the conclusion in our next session.",
            unread: true
          },
          {
            id: 5,
            name: "David Rodriguez",
            email: "liyuxiao2@gmail.com",
            subjects: ["Spanish", "French"],
            rating: 4.9,
            hourlyRate: 45,
            education: "BA in Linguistics, NYU",
            bio: "Native Spanish speaker with fluency in French. I make language learning fun and practical with real-world conversations.",
            profileImage: "/placeholder-avatar.png",
            matchDate: "2023-04-01T15:45:00Z",
            lastMessage: "¡Hola! Don't forget to practice the verb conjugations we covered.",
            unread: false
          }
        ];
        
        // INTEGRATION POINT: In your actual implementation, you would:
        // 1. Fetch matches from your backend API
        // 2. Connect to the matches created in your match section
        // 3. Store match data in your database
        
        setMatches(mockMatches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter matches based on search term (by name)
  const filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a tutor to email
  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
    setEmailContent({
      subject: `TutorMatch: Session with ${tutor.name}`,
      message: `Hi ${tutor.name},\n\nI'd like to schedule a tutoring session with you for ${tutor.subjects[0]}.\n\nBest regards,\n[Your Name]`
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    setEmailStatus({ type: "loading", message: "Sending email..." });
  
    try {
      
      const emailEndpoint = "http://localhost/TutorMatch/server/email/email.php";
      
      const response = await fetch(emailEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies/session data
        body: JSON.stringify({
          to: selectedTutor.email,
          subject: emailContent.subject,
          message: emailContent.message,
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setEmailStatus({ type: "success", message: "Email sent successfully!" });
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailStatus({ type: "", message: "" });
        }, 2000);
      } else {
        // Check if we need to authenticate first
        if (result.redirect) {
          setEmailStatus({ type: "info", message: "Authentication required. Redirecting to Google login..." });
          
          // Open authentication in a new window
          const authWindow = window.open(result.redirect, "googleAuth", "width=600,height=600");
          
          // Check when authentication window is closed
          const checkAuthWindow = setInterval(() => {
            if (authWindow.closed) {
              clearInterval(checkAuthWindow);
              setEmailStatus({ type: "info", message: "Authentication completed. Trying to send email again..." });
              
              // Try sending email again after a short delay
              setTimeout(() => {
                handleSendEmail();
              }, 1000);
            }
          }, 500);
        } else {
          setEmailStatus({ type: "error", message: result.error || "Failed to send email. Please try again." });
        }
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus({ type: "error", message: "An error occurred while sending the email." });
    }
  };
 

  const handleSendChatMessage = () => {
    if (chatInput.trim() === "") {
      return; // Do nothing if the input is empty
    }
  
    // Add the user's message to the chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", message: chatInput.trim() },
    ]);
  
    // Clear the chat input field
    setChatInput("");
  
    // Simulate a response from the tutor
    setTimeout(() => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "tutor", message: "Thanks for your message! I'll get back to you soon." },
      ]);
    }, 1000); // Simulate a 1-second delay
  };

  if (loading) {
    return (
      <div className="inbox-loading">
        <div className="loader"></div>
        <p>Loading your matches...</p>
      </div>
    );
  }

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
            <Card key={match.id} className="tutor-match-card">
              <div className="match-header">
                <div className="match-date">
                  Matched on {new Date(match.matchDate).toLocaleDateString()}
                </div>
                {match.unread && <div className="unread-badge">New</div>}
              </div>
              
              <div className="tutor-info">
                <div className="tutor-image">
                  <img src={match.profileImage || "/placeholder-avatar.png"} alt={match.name} />
                </div>
                <div className="tutor-details">
                  <h3>{match.name}</h3>
                  <div className="tutor-subjects">
                    {match.subjects.map((subject, index) => (
                      <span key={index} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                  <div className="tutor-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(match.rating) ? "star filled" : "star"}>★</span>
                      ))}
                    </div>
                    <span className="rating-value">{match.rating.toFixed(1)}</span>
                  </div>
                  <div className="tutor-education">{match.education}</div>
                  <div className="tutor-rate">${match.hourlyRate}/hour</div>
                </div>
              </div>
              
              <div className="tutor-bio">
                <p>{match.bio}</p>
              </div>
              
              <div className="last-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>{match.lastMessage}</p>
              </div>
              
              <div className="match-actions">
                <button className="action-button primary" onClick={() => handleSelectTutor(match)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </button>
                <button className="action-button secondary" onClick={ () => {
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
                <button className="action-button secondary" onClick={ () => {
                  setChatTutor(match);
                  setShowChatModal(true);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Chat
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="no-matches">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="15" x2="16" y2="15"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <p>No matches found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
      
      {showEmailModal && (
      <div className="email-modal-overlay">
        <div className="email-modal">
          <div className="email-modal-header">
            <h3>Email {selectedTutor.name}</h3>
            <button className="close-button" onClick={() => setShowEmailModal(false)}>×</button>
          </div>
          <div className="email-modal-content">
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
          </div>
          <div className="email-modal-footer">
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
          </div>
        </div>
      </div>
    )}


      {showCalendarModal && (
      <div className="email-modal-overlay">
        <div className="email-modal">
          <div className="email-modal-header">
            <h3>Schedule with {calendarTutor?.name}</h3>
          </div>
          
          <div className="email-body">
            <label style={{textAlign: "center"}}>Select a date:</label>
            <MyCalendar 
                selectedDate={selectedDate}
                onDateChange={(date) => setSelectedDate(date)}
                context="modal"
              />
          </div>
          
          <div className="email-modal-footer">
            <button className = "cancel-button" onClick={() => setShowCalendarModal(false)}>Cancel</button>
            <button
              className="send-button"
              onClick={() => {
                alert(`Scheduled session with ${calendarTutor?.name} on ${selectedDate.toDateString()}`);
                setShowCalendarModal(false);
              }}
            >
              Confirm Date
            </button>
          </div>
        </div>
      </div>
    )}

    {showChatModal && (
      <div className="email-modal-overlay">
        <div className="email-modal chat">
          <div className="email-modal-header">
            <h3>Chat with {chatTutor?.name}</h3>
            <button className="close-button" onClick={() => setShowChatModal(false)}>×</button>
          </div>
          <div className="email-modal-content">
            <div className="chat-messages">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`}>{msg.message}</div>
              ))}
            </div>
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendChatMessage}>Send</button>
          </div>
        </div>
      </div>
    )}

    </div>
    
  );
}

export default Inbox;