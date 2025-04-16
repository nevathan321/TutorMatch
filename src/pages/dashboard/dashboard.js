"use client"

import { useState, useEffect } from "react"
import "./dashboard.css"
import Card from "../../../components/card/card"
import MyCalendar from "../../../components/calendar/MyCalendar"
import { FaCalendarAlt, FaUserGraduate, FaDollarSign } from "react-icons/fa"
import ToastContainer from "../../../components/ToastContainer/ToastContainer"
import Transaction from "../../../components/transaction/Transaction"

function Dashboard() {
  const [stats, setStats] = useState({
    totalSessions: 12,
    upcomingSessions: 2,
    students: 5,
    earnings: 450,
  })

  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [recentStudents, setRecentStudents] = useState([])
  const [reviews, setReviews] = useState([])
  const [transactions, setTransactions] = useState([])

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch data from your backend
    setUpcomingSessions([
      { id: 1, date: "2023-04-15", time: "14:00", student: "Alex Johnson", subject: "Mathematics" },
      { id: 2, date: "2023-04-18", time: "16:30", student: "Emily Davis", subject: "Biology" },
    ])

    setRecentStudents([
      { id: 1, name: "Alex Johnson", subject: "Mathematics", matchedOn: "2023-04-10" },
      { id: 2, name: "Sarah Williams", subject: "English Literature", matchedOn: "2023-04-05" },
    ])

    setReviews([
      {
        id: 1,
        student: "Alex Johnson",
        rating: 5,
        comment:
          "Excellent tutor! Very knowledgeable and patient. Explains complex concepts in a way that's easy to understand.",
        date: "2023-04-10",
      },
      {
        id: 2,
        student: "Sarah Williams",
        rating: 4,
        comment: "Great session. Really helped me understand the material. Would recommend!",
        date: "2023-04-05",
      },
    ])

    setTransactions([
      {
        id: 1,
        type: "Payment",
        amount: 100,
        status: "Completed",
        date: "2023-04-10",
        time: "14:30",
        transactionId: "1000000",
      },
      {
        id: 2,
        type: "Payment",
        amount: 75,
        status: "Pending",
        date: "2023-04-15",
        time: "10:15",
        transactionId: "1000001",
      },
      {
        id: 3,
        type: "Refund",
        amount: 50,
        status: "Completed",
        date: "2023-03-28",
        time: "16:45",
        transactionId: "1000002",
      },
    ])
  }, [])

  return (
    <div className="dashboard-container">
      <ToastContainer />

      <div className="dashboard-header">
        <h1>Welcome to Your Tutor Dashboard</h1>
        <p>Manage your sessions and connect with students</p>
      </div>

      <div className="stats-container">
        <Card>
          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>Total Sessions</h3>
              <p className="stat-number">{stats.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>Upcoming</h3>
              <p className="stat-number">{stats.upcomingSessions}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserGraduate />
            </div>
            <div className="stat-content">
              <h3>Students</h3>
              <p className="stat-number">{stats.students}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>Earnings</h3>
              <p className="stat-number">${stats.earnings}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Students</h2>
            <a href="/tutor/inbox" className="view-all">
              View All
            </a>
          </div>
          <Card>
            {recentStudents.map((student) => (
              <div key={student.id} className="student-item">
                <div className="student-avatar">{student.name.charAt(0)}</div>
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>{student.subject}</p>
                  <p className="match-date">Matched on {student.matchedOn}</p>
                </div>
                <button className="contact-btn">Contact</button>
              </div>
            ))}
          </Card>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Sessions</h2>
            <button className="new-session-btn">+ New Session</button>
          </div>
          <Card>
            <MyCalendar
              events={upcomingSessions.map((session) => ({
                id: session.id,
                title: `${session.student} - ${session.subject}`,
                start: new Date(`${session.date}T${session.time}`),
                end: new Date(new Date(`${session.date}T${session.time}`).getTime() + 60 * 60 * 1000),
              }))}
            />
          </Card>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Latest Reviews</h2>
            <a href="/tutor/reviews" className="view-all">
              View All
            </a>
          </div>
          <Card>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "star filled" : "star"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <h3>{review.rating === 5 ? "Excellent feedback!" : "Great session"}</h3>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-footer">
                  <p className="student-name">{review.student}</p>
                  <p className="review-date">{review.date}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <a href="/tutor/transactions" className="view-all">
              View All
            </a>
          </div>
          <Card>
            {transactions.map((transaction) => (
              <Transaction
                key={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                status={transaction.status}
                date={transaction.date}
                time={transaction.time}
                transactionId={transaction.transactionId}
              />
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
