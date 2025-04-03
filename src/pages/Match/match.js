import React, { useState } from 'react';
import TutorCard from '../../components/TutorCard/TutorCard';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import './match.css';

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
  
  // Handle rejecting a tutor (swipe left)
  const handleReject = () => {
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
  };
  
  // Handle accepting a tutor (swipe right)
  const handleAccept = () => {
    // Add the current tutor to the accepted list
    setAcceptedTutors([...acceptedTutors, tutors[currentTutorIndex]]);
    
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
    
    // In a real app, you would send this match to your backend
    console.log('Accepted tutor:', tutors[currentTutorIndex]);
  };
  
  const handleSeeMoreReviews = () => {
    // Implement functionality to show more reviews
    console.log('Show more reviews for', tutors[currentTutorIndex].name);
  };
  
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Match;