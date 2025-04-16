"use client"

import { useState, useEffect } from "react"
import "./match.css"
import Card from "../../../components/card/card"
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa"
import ToastContainer from "../../../components/ToastContainer/ToastContainer"

function Match() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [potentialStudents, setPotentialStudents] = useState([])

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch data from your backend
    setPotentialStudents([
      {
        id: 1,
        name: "Alex Johnson",
        subjects: ["Mathematics", "Physics"],
        bio: "Struggling with calculus and need help preparing for my finals. Looking for a patient tutor who can explain complex concepts clearly.",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        education: "Undergraduate, McMaster University",
        rating: 4.8,
      },
      {
        id: 2,
        name: "Sarah Williams",
        subjects: ["English Literature"],
        bio: "Working on my thesis and need guidance with literary analysis and academic writing. Available evenings and weekends.",
        preferredDays: ["Tuesday", "Thursday", "Saturday"],
        education: "Graduate Student, McMaster University",
        rating: 4.5,
      },
      {
        id: 3,
        name: "Michael Brown",
        subjects: ["Computer Science", "Mathematics"],
        bio: "Need help with algorithms and data structures. Preparing for technical interviews and want to strengthen my problem-solving skills.",
        preferredDays: ["Monday", "Thursday", "Sunday"],
        education: "Senior Undergraduate, McMaster University",
        rating: 4.7,
      },
    ])
  }, [])

  const handleAccept = () => {
    // Handle accepting the student
    console.log("Accepted student:", potentialStudents[currentIndex])
    nextStudent()
  }

  const handleReject = () => {
    // Handle rejecting the student
    console.log("Rejected student:", potentialStudents[currentIndex])
    nextStudent()
  }

  const nextStudent = () => {
    if (currentIndex < potentialStudents.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // No more students to show
      alert("No more potential students to show!")
    }
  }

  const prevStudent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (potentialStudents.length === 0) {
    return (
      <div className="match-container">
        <ToastContainer />
        <div className="match-header">
          <h1>Find Your Next Student</h1>
          <p>No potential students available at the moment</p>
        </div>
      </div>
    )
  }

  const currentStudent = potentialStudents[currentIndex]

  return (
    <div className="match-container">
      <ToastContainer />

      <div className="match-header">
        <h1>Find Your Next Student</h1>
        <p>Review and connect with students who need your expertise</p>
      </div>

      <div className="match-card-container">
        <button className="nav-button prev-button" onClick={prevStudent} disabled={currentIndex === 0}>
          <FaChevronLeft />
        </button>

        <Card className="student-match-card">
          <div className="student-profile">
            <div className="student-avatar">{currentStudent.name.charAt(0)}</div>
            <h2 className="student-name">{currentStudent.name}</h2>

            <div className="subject-tags">
              {currentStudent.subjects.map((subject, index) => (
                <span key={index} className="subject-tag">
                  {subject}
                </span>
              ))}
            </div>

            <div className="student-education">{currentStudent.education}</div>

            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(currentStudent.rating) ? "star filled" : "star"}>
                  ★
                </span>
              ))}
              <span className="rating-number">{currentStudent.rating}</span>
            </div>

            <div className="student-bio">
              <h3>About the Student</h3>
              <p>{currentStudent.bio}</p>
            </div>

            <div className="preferred-days">
              <h3>Preferred Days</h3>
              <div className="days-container">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                  <span
                    key={index}
                    className={`day-tag ${currentStudent.preferredDays.includes(day) ? "available" : "unavailable"}`}
                  >
                    {day.substring(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button className="reject-button" onClick={handleReject}>
                <FaTimes /> Reject
              </button>
              <button className="accept-button" onClick={handleAccept}>
                <FaCheck /> Accept
              </button>
            </div>
          </div>
        </Card>

        <button
          className="nav-button next-button"
          onClick={nextStudent}
          disabled={currentIndex === potentialStudents.length - 1}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  )
}

export default Match
