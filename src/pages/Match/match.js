/*Change js*/

import React, { useState, useEffect } from 'react';
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
    image: '/tutors/john-doe.png', // Replace with actual image path
    review: {
      title: 'AMAZING',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.',
      reviewerName: 'Ashley',
      reviewerImage: '/reviewers/ashley.png', // Replace with actual image path
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
    image: '/tutors/jane-smith.png', // Replace with actual image path
    review: {
      title: 'VERY HELPFUL',
      text: 'Explained complex concepts in a simple way. Would recommend!',
      reviewerName: 'Michael',
      reviewerImage: '/reviewers/michael.png', // Replace with actual image path
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
    image: '/tutors/alex-johnson.png', // Replace with actual image path
    review: {
      title: 'EXCEPTIONAL',
      text: 'Alex helped me understand algorithms that I was struggling with for weeks.',
      reviewerName: 'Sarah',
      reviewerImage: '/reviewers/sarah.png', // Replace with actual image path
      date: 'March 10, 2024'
    }
  }
];

function Match() {
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  const [tutors, setTutors] = useState(tutorsData);
  
  const handlePrevious = () => {
    if (currentTutorIndex > 0) {
      setCurrentTutorIndex(currentTutorIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentTutorIndex < tutors.length - 1) {
      setCurrentTutorIndex(currentTutorIndex + 1);
    }
  };
  
  const handleSeeMoreReviews = () => {
    // Implement functionality to show more reviews
    console.log('Show more reviews for', tutors[currentTutorIndex].name);
  };
  
  // In a real app, you would fetch tutors from an API
  // useEffect(() => {
  //   const fetchTutors = async () => {
  //     try {
  //       const response = await fetch('/api/tutors');
  //       const data = await response.json();
  //       setTutors(data);
  //     } catch (error) {
  //       console.error('Error fetching tutors:', error);
  //     }
  //   };
  //   
  //   fetchTutors();
  // }, []);
  
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
              onPrevious={handlePrevious} 
              onNext={handleNext}
            />
          </>
        ) : (
          <div className="loading-state">Loading tutors...</div>
        )}
      </div>
    </div>
  );
}

export default Match;