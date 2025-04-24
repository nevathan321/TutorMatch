/**
* Group Members: Nevathan, Liyu, Adrian, Abishan
* Date: April 20, 2025
*
* Match component for displaying and managing tutor matches.
* Allows users to browse, accept, or reject tutor profiles.
* Communicates with backend APIs to update match and rejection data.
* Notifies users about successful matches and simulates tutor responses.
*/


import { useState, useEffect } from "react"
import TutorCard from "../../components/TutorCard/TutorCard"
import { useNotifications } from "../../context/NotificationContext"
import "./match.css"

// Sample data - replace with API call in a real application

function Match({ userProfile }) {
  const [tutors, setTutors] = useState([]);
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  const { addNotification } = useNotifications();

  const fetchTutors = async () => {
    try {
      const response = await fetch(
        `http://localhost/tutorMatch/server/match/getTutors.php?tuteeID=${userProfile.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const tutorsResult = await response.json();
      setTutors(tutorsResult);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const updateMatchedTutors = async (tutorID) => {
    try {
      // eslint-disable-next-line
      const response = await fetch(
        `http://localhost/tutorMatch/server/match/updateMatches.php?tutorID=${tutorID}&tuteeID=${userProfile.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      //const result = await response.json();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const updateRejectedTutors = async (tutorID) => {
    try {
      // eslint-disable-next-line
      const response = await fetch(
        `http://localhost/tutorMatch/server/match/updateRejectedTutors.php?tutorID=${tutorID}&tuteeID=${userProfile.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      //const result = await response.json();
      
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    //run on load
    fetchTutors();
    // eslint-disable-next-line
  }, []);

  // Handle rejecting a tutor (swipe left)
  const handleReject = () => {
    if (tutors.length === 0) return;
    updateRejectedTutors(tutors[currentTutorIndex].id)
   
    // Remove the current tutor from the list
    const updatedTutors = [...tutors];
    updatedTutors.splice(currentTutorIndex, 1);

    if (updatedTutors.length === 0) {
      // No more tutors to show
      setTutors([])
     
    } else {
      setTutors(updatedTutors)
      // If we're at the end of the list, go back to the first tutor
      if (currentTutorIndex >= updatedTutors.length) {
        setCurrentTutorIndex(0)
      }
    }
  };

  // Handle accepting a tutor (swipe right)
  const handleAccept = () => {
    if (tutors.length === 0) return;
    updateMatchedTutors(tutors[currentTutorIndex].id)
    // Initialize audio on user interaction


    // Remove the current tutor from the list
    const updatedTutors = [...tutors]
    updatedTutors.splice(currentTutorIndex, 1)

    if (updatedTutors.length === 0) {
      // No more tutors to show
      setTutors([])
   
    } else {
      setTutors(updatedTutors)
      // If we're at the end of the list, go back to the first tutor
      if (currentTutorIndex >= updatedTutors.length) {
        setCurrentTutorIndex(0)
      }
    }
    // Add a notification for the match
    addNotification({
      title: "New Match!",
      message: `You've matched with ${tutors[currentTutorIndex].full_name}! You can now start a conversation.`,
      type: "success",
    });

    // Simulate a tutor response after a delay (for demonstration)
    setTimeout(() => {
      addNotification({
        title: `Message from ${tutors[currentTutorIndex].full_name}`,
        message: `Hi there! Thanks for matching with me. I'd be happy to help with your studies.`,
        type: "info",
      });
    }, 4000); 
  };

  const handleSeeMoreReviews = () => {
    if (tutors.length === 0) return;

    

  };

  
  const handlePrevTutor = () => {
    if (tutors.length <= 1) return;

    setCurrentTutorIndex((prevIndex) =>
      prevIndex === 0 ? tutors.length - 1 : prevIndex - 1
    );
  };

  
  const handleNextTutor = () => {
    if (tutors.length <= 1) return;

    setCurrentTutorIndex((prevIndex) =>
      prevIndex === tutors.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (tutors.length === 0) return (
    <div className="match-container">
      <div className="tutor-card-container">
      <p className="no-tutors-note">You've gone through all available tutors at this time.</p>  
      <p className="no-tutors-note">
        We're constantly adding new tutors to our platform. We'll
        email you as soon as we have new matches that fit your needs!
      </p>
      </div>
    </div>
  );
  return (
    <div className="match-container">
      <h1 className="match-heading">Let's Find Your Perfect Tutor!</h1>


      <div className="tutor-card-container">
          <div className="tutor-card-with-navigation">
            
            <button
              className="arrow-button prev"
              onClick={handlePrevTutor}
              aria-label="Previous tutor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            
            <TutorCard
              tutor={tutors[currentTutorIndex]}
              onSeeMoreReviews={handleSeeMoreReviews}
              onAccept={handleAccept}
              onReject={handleReject}
            />

            
            <button
              className="arrow-button next"
              onClick={handleNextTutor}
              aria-label="Next tutor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
      </div>
    </div>
  )
}

export default Match;
