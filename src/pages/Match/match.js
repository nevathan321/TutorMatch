import React, { useState, useEffect } from 'react';
import TutorCard from '../../components/TutorCard/TutorCard';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { useNotifications } from '../../context/NotificationContext';
import './match.css'
// Sample data - replace with API call in a real application
const tutorsData = [
  {
    id: 1,
    name: 'John Doe',
    subjects: ['Chemistry', 'Physics'],
    priceRange: '$45-50/Hr',
    education: 'PhD student at McMaster',
    rating: 3,
    image: '/placeholder-tutor.png',
    review: {
      title: 'AMAZING',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.',
      reviewerName: 'Ashley',
      reviewerImage: '/placeholder-avatar.png',
      date: 'March 23, 2024'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    subjects: ['Mathematics', 'Statistics'],
    priceRange: '$40-45/Hr',
    education: 'MSc in Mathematics at UofT',
    rating: 4,
    image: '/placeholder-tutor.png',
    review: {
      title: 'VERY HELPFUL',
      text: 'Explained complex concepts in a simple way. Would recommend!',
      reviewerName: 'Michael',
      reviewerImage: '/placeholder-avatar.png',
      date: 'March 15, 2024'
    }
  },
  {
    id: 3,
    name: 'Alex Johnson',
    subjects: ['Computer Science', 'Programming'],
    priceRange: '$55-60/Hr',
    education: 'Software Engineer at Google',
    rating: 5,
    image: '/placeholder-tutor.png',
    review: {
      title: 'EXCEPTIONAL',
      text: 'Alex helped me understand algorithms that I was struggling with for weeks.',
      reviewerName: 'Sarah',
      reviewerImage: '/placeholder-avatar.png',
      date: 'March 10, 2024'
    }
  }
];

function Match() {
  const [tutors, setTutors] = useState(tutorsData);
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  const [acceptedTutors, setAcceptedTutors] = useState([]);
  const { addNotification } = useNotifications();
  
  // Handle rejecting a tutor (swipe left)
  const handleReject = () => {
    const rejectedTutor = tutors[currentTutorIndex];
    
    // Remove the current tutor from the list
    const updatedTutors = [...tutors];
    updatedTutors.splice(currentTutorIndex, 1);
    
    if (updatedTutors.length === 0) {
      // No more tutors to show
      setTutors([]);
    } else {
      setTutors(updatedTutors);
      // If we're at the end of the list, go back to the first tutor
      if (currentTutorIndex >= updatedTutors.length) {
        setCurrentTutorIndex(0);
      }
    }
    
    // Add a notification for the rejection (optional)
    addNotification({
      title: 'Tutor Rejected',
      message: `You've rejected ${rejectedTutor.name} as a potential tutor.`,
      type: 'info'
    });
  };
  
  // Handle accepting a tutor (swipe right)
  const handleAccept = () => {
    const acceptedTutor = tutors[currentTutorIndex];
    
    // Add the current tutor to the accepted list
    setAcceptedTutors([...acceptedTutors, acceptedTutor]);
    
    // Remove the current tutor from the list
    const updatedTutors = [...tutors];
    updatedTutors.splice(currentTutorIndex, 1);
    
    if (updatedTutors.length === 0) {
      // No more tutors to show
      setTutors([]);
    } else {
      setTutors(updatedTutors);
      // If we're at the end of the list, go back to the first tutor
      if (currentTutorIndex >= updatedTutors.length) {
        setCurrentTutorIndex(0);
      }
    }
    
    // Add a notification for the match
    addNotification({
      title: 'New Match!',
      message: `You've matched with ${acceptedTutor.name}! You can now start a conversation.`,
      type: 'success'
    });
    
    // Simulate a tutor response after a delay (for demonstration)
    setTimeout(() => {
      addNotification({
        title: `Message from ${acceptedTutor.name}`,
        message: `Hi there! Thanks for matching with me. I'd be happy to help with your ${acceptedTutor.subjects[0]} studies.`,
        type: 'info'
      });
    }, 10000); // 10 seconds later
  };
  
  const handleSeeMoreReviews = () => {
    const currentTutor = tutors[currentTutorIndex];
    // Add a notification when user wants to see more reviews
    addNotification({
      title: 'Reviews Loading',
      message: `Loading more reviews for ${currentTutor.name}...`,
      type: 'info'
    });
    
    // Simulate loading reviews
    setTimeout(() => {
      addNotification({
        title: 'Reviews Available',
        message: `5 more reviews available for ${currentTutor.name}`,
        type: 'success'
      });
    }, 2000);
  };
  
  // Add a welcome notification when the component mounts
  useEffect(() => {
    // Only show welcome notification if it's the first visit
    const hasVisitedBefore = localStorage.getItem('tutorMatchVisited');
    
    if (!hasVisitedBefore) {
      setTimeout(() => {
        addNotification({
          title: 'Welcome to TutorMatch!',
          message: 'Start swiping to find your perfect tutor match.',
          type: 'info'
        });
        
        localStorage.setItem('tutorMatchVisited', 'true');
      }, 1000);
      
      // Add a tip notification after a short delay
      setTimeout(() => {
        addNotification({
          title: 'Quick Tip',
          message: 'Swipe right on tutors you like, left on those you want to skip.',
          type: 'info'
        });
      }, 5000);
    }
    
    // Simulate a system notification after a delay
    setTimeout(() => {
      addNotification({
        title: 'New Tutors Available',
        message: 'We\'ve added 5 new tutors in your area for Mathematics and Physics!',
        type: 'success'
      });
    }, 15000);
  }, [addNotification]);
  
  return (
    <div className="match-container">
      <h1 className="match-heading">Let's Find Your Perfect Tutor!</h1>
      
      <div className="tutor-card-container">
        {tutors.length > 0 ? (
          <>
            <TutorCard 
              tutor={tutors[currentTutorIndex]} 
              onSeeMoreReviews={handleSeeMoreReviews}
            />
            <NavigationButtons 
              onReject={handleReject} 
              onAccept={handleAccept}
            />
          </>
        ) : (
          <div className="no-tutors-message">
            <h2>No more tutors available</h2>
            <p>You've gone through all available tutors.</p>
            {acceptedTutors.length > 0 && (
              <p>You've matched with {acceptedTutors.length} tutor(s).</p>
            )}
            <button 
              className="refresh-tutors-button"
              onClick={() => {
                setTutors(tutorsData);
                setCurrentTutorIndex(0);
                addNotification({
                  title: 'Tutors Refreshed',
                  message: 'We\'ve refreshed your tutor list!',
                  type: 'success'
                });
              }}
            >
              Refresh Tutors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Match;