import React, { useState, useEffect } from "react";
import TutorCard from "../../components/TutorCard/TutorCard";
import { useNotifications } from "../../context/NotificationContext";
import "./match.css";

// Sample data - replace with API call in a real application

function Match({ userProfile }) {
  const [tutors, setTutors] = useState([]);
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  const [acceptedTutors, setAcceptedTutors] = useState([]);
  const [rejectedTutors, setRejectedTutors] = useState([]);
  const [allTutorsViewed, setAllTutorsViewed] = useState(false);
  const { addNotification, initializeAudio } = useNotifications();

  const fetchTutors = async () => {
    try {
      const response = await fetch(
        "http://localhost/tutorMatch/server/match/getTutors.php",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const tutorsResult = await response.json();
      console.log(tutorsResult);
      setTutors(tutorsResult);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const updatedMatchedTutors = async (tutorID) => {
    try {
      const response = await fetch(
        `http://localhost/tutorMatch/server/match/updateMatches.php?tutorID=${tutorID}&tuteeID=${userProfile.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    //run on load
    fetchTutors();
  }, []);

  // Handle rejecting a tutor (swipe left)
  const handleReject = () => {
    if (tutors.length === 0) return;

    const rejectedTutor = tutors[currentTutorIndex];

    // Add to rejected list
    setRejectedTutors((prev) => [...prev, rejectedTutor]);

    // Remove the current tutor from the list
    const updatedTutors = [...tutors];
    updatedTutors.splice(currentTutorIndex, 1);

    if (updatedTutors.length === 0) {
      // No more tutors to show
      setTutors([]);
      setAllTutorsViewed(true);
    } else {
      setTutors(updatedTutors);
      // If we're at the end of the list, go back to the first tutor
      if (currentTutorIndex >= updatedTutors.length) {
        setCurrentTutorIndex(0);
      }
    }
  };

  // Handle accepting a tutor (swipe right)
  const handleAccept = () => {
    if (tutors.length === 0) return;
    updatedMatchedTutors(tutors[currentTutorIndex].id)
    // Initialize audio on user interaction
    initializeAudio();

    const acceptedTutor = tutors[currentTutorIndex];

    // Add the current tutor to the accepted list
    setAcceptedTutors((prev) => [...prev, acceptedTutor]);

    // Remove the current tutor from the list
    const updatedTutors = [...tutors];
    updatedTutors.splice(currentTutorIndex, 1);
    
    if (updatedTutors.length === 0) {
      // No more tutors to show
      setTutors([]);
      setAllTutorsViewed(true);
    } else {
      setTutors(updatedTutors);
      // If we're at the end of the list, go back to the first tutor
      if (currentTutorIndex >= updatedTutors.length) {
        setCurrentTutorIndex(0);
      }
    }

    // Add a notification for the match
    addNotification({
      title: "New Match!",
      message: `You've matched with ${acceptedTutor.name}! You can now start a conversation.`,
      type: "success",
    });

    // Simulate a tutor response after a delay (for demonstration)
    setTimeout(() => {
      addNotification({
        title: `Message from ${acceptedTutor.name}`,
        message: `Hi there! Thanks for matching with me. I'd be happy to help with your studies.`,
        type: "info",
      });
    }, 10000); // 10 seconds later
  };

  const handleSeeMoreReviews = () => {
    if (tutors.length === 0) return;

    // No notification for seeing more reviews
    console.log("Showing more reviews for", tutors[currentTutorIndex].name);
  };

  // Navigate to previous tutor
  const handlePrevTutor = () => {
    if (tutors.length <= 1) return;

    setCurrentTutorIndex((prevIndex) =>
      prevIndex === 0 ? tutors.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next tutor
  const handleNextTutor = () => {
    if (tutors.length <= 1) return;

    setCurrentTutorIndex((prevIndex) =>
      prevIndex === tutors.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle refreshing tutors
  // const handleRefreshTutors = () => {

  //   const allInteractedIds = [...acceptedTutors, ...rejectedTutors].map(tutor => tutor.id);
  //   const freshTutors = tutorsData.filter(tutor => !allInteractedIds.includes(tutor.id));

  //   if (freshTutors.length > 0) {
  //     setTutors(freshTutors);
  //     setCurrentTutorIndex(0);
  //     setAllTutorsViewed(false);
  //   } else {

  //     setAllTutorsViewed(true);
  //   }
  // };
  if (tutors.length === 0) return;
  return (
    <div className="match-container">
      <h1 className="match-heading">Let's Find Your Perfect Tutor!</h1>

      <div className="tutor-card-container">
        {tutors.length > 0 ? (
          <div className="tutor-card-with-navigation">
            {/* Previous button positioned absolutely */}
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

            {/* Tutor card */}
            <TutorCard
              tutor={tutors[currentTutorIndex]}
              onSeeMoreReviews={handleSeeMoreReviews}
              onAccept={handleAccept}
              onReject={handleReject}
            />

            {/* Next button positioned absolutely */}
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
        ) : (
          <div className="no-tutors-message">
            <h2>
              {allTutorsViewed
                ? "No more tutors available"
                : "Loading tutors..."}
            </h2>
            {allTutorsViewed && (
              <>
                <p>You've gone through all available tutors at this time.</p>
                {acceptedTutors.length > 0 && (
                  <p>You've matched with {acceptedTutors.length} tutor(s)!</p>
                )}
                <p className="no-tutors-note">
                  We're constantly adding new tutors to our platform. We'll
                  email you as soon as we have new matches that fit your needs!
                </p>
                <button
                  className="refresh-tutors-button"
                  // onClick={handleRefreshTutors}
                >
                  Check for New Tutors
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Match;
