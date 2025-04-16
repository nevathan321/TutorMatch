"use client"

import { useState, useEffect } from "react"
import "./inbox.css"
import Card from "../../../components/card/card"
import { FaEnvelope, FaCalendarAlt, FaComments } from "react-icons/fa"
import ToastContainer from "../../../components/ToastContainer/ToastContainer"

function Inbox() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch data from your backend
    setStudents([
      {
        id: 1,
        name: "Alex Johnson",
        matchedOn: "2023-04-10",
        subjects: ["Mathematics"],
        rating: 4.2,
        education: "Undergraduate in Mathematics, McMaster",
        message: "Looking forward to our session tomorrow!",
        isNew: true,
      },
      {
        id: 2,
        name: "Sarah Williams",
        matchedOn: "2023-04-05",
        subjects: ["English Literature", "History"],
        rating: 4.6,
        education: "MA in English, McMaster",
        message: "I've sent you the study materials for our next session.",
        isNew: false,
      },
      {
        id: 3,
        name: "Michael Brown",
        matchedOn: "2023-04-15",
        subjects: ["Computer Science", "Mathematics"],
        rating: 4.7,
        education: "BSc in Computer Science, UC Berkeley",
        message: "Great progress today! Let's continue with algorithms next time.",
        isNew: true,
      },
      {
        id: 4,
        name: "Emily Davis",
        matchedOn: "2023-04-08",
        subjects: ["Biology", "Chemistry"],
        rating: 4.5,
        education: "MSc in Biochemistry, MIT",
        message: "Thanks for explaining the concepts so clearly!",
        isNew: false,
      },
      {
        id: 5,
        name: "David Rodriguez",
        matchedOn: "2023-04-01",
        subjects: ["Spanish", "French"],
        rating: 4.9,
        education: "BA in Linguistics, McMaster",
        message: "¡Hola! Ready for our Spanish conversation practice?",
        isNew: false,
      },
    ])
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="inbox-container">
      <ToastContainer />

      <div className="inbox-header">
        <h1>Your Students</h1>
        <p>Connect with your matched students</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search students by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="students-count">{filteredStudents.length} Matched Students</div>

      <div className="students-grid">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="student-card">
            <div className="student-header">
              <div className="matched-date">Matched on {student.matchedOn}</div>
              {student.isNew && <div className="new-badge">New</div>}
            </div>

            <div className="student-name">{student.name}</div>

            <div className="subject-tags">
              {student.subjects.map((subject, index) => (
                <span key={index} className="subject-tag">
                  {subject}
                </span>
              ))}
            </div>

            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(student.rating) ? "star filled" : "star"}>
                  ★
                </span>
              ))}
              <span className="rating-number">{student.rating}</span>
            </div>

            <div className="education">{student.education}</div>

            <div className="last-message">
              <p>{student.message}</p>
            </div>

            <div className="action-buttons">
              <button className="action-btn email-btn">
                <FaEnvelope /> Email
              </button>
              <button className="action-btn schedule-btn">
                <FaCalendarAlt /> Schedule
              </button>
              <button className="action-btn chat-btn">
                <FaComments /> Chat
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Inbox
