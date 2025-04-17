"use client"

// src/pages/inbox/inbox.js
import { useState, useEffect } from "react"
import "./inbox.css"

import MyCalendar from "../../components/calendar/MyCalendar"

function Inbox() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [emailContent, setEmailContent] = useState({ subject: "", message: "" })
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailStatus, setEmailStatus] = useState({ type: "", message: "" })

  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarTutor, setCalendarTutor] = useState(null)

  const [showChatModal, setShowChatModal] = useState(false)
  const [chatTutor, setChatTutor] = useState(null)

  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const loadMatchesFromStorage = () => {
    try {
      const storedAcceptedTutors = localStorage.getItem("acceptedTutors")
      let acceptedTutorsFromMatch = []

      if (storedAcceptedTutors) {
        acceptedTutorsFromMatch = JSON.parse(storedAcceptedTutors)
      }

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
          unread: true,
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
          unread: false,
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
          unread: false,
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
          unread: true,
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
          unread: false,
        },
      ]

      const formattedAcceptedTutors = acceptedTutorsFromMatch.map((tutor) => {
        return {
          id: tutor.id,
          name: tutor.name,
          email: `${tutor.name.toLowerCase().replace(" ", ".")}@example.com`,
          subjects: tutor.subjects,
          rating: tutor.rating,
          hourlyRate: Number.parseInt(tutor.priceRange.replace(/[^0-9]/g, "")),
          education: tutor.education,
          bio: tutor.review.text,
          profileImage: tutor.image || "/placeholder-avatar.png",
          matchDate: new Date().toISOString(),
          lastMessage: "I'd be happy to help with your studies!",
          unread: true,
        }
      })

      const existingIds = new Set(mockMatches.map((tutor) => tutor.id))
      const uniqueAcceptedTutors = formattedAcceptedTutors.filter((tutor) => !existingIds.has(tutor.id))

      const combinedMatches = [...mockMatches, ...uniqueAcceptedTutors]
      return combinedMatches
    } catch (error) {
      console.error("Error loading matches:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const combinedMatches = loadMatchesFromStorage()
        setMatches(combinedMatches)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching matches:", error)
        setLoading(false)
      }
    }

    fetchMatches()

    const handleTutorMatched = () => {
      console.log("Tutor matched event received!")
      const updatedMatches = loadMatchesFromStorage()
      setMatches(updatedMatches)
    }

    window.addEventListener("tutorMatched", handleTutorMatched)

    return () => {
      window.removeEventListener("tutorMatched", handleTutorMatched)
    }
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredMatches = matches.filter((match) => match.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor)
    setEmailContent({
      subject: `TutorMatch: Session with ${tutor.name}`,
      message: `Hi ${tutor.name},\n\nI'd like to schedule a tutoring session with you for ${tutor.subjects[0]}.\n\nBest regards,\n[Your Name]`,
    })
    setShowEmailModal(true)
  }

  const handleSendChatMessage = () => {
    if (chatInput.trim() === "") return

    setChatHistory((prevHistory) => [...prevHistory, { sender: "user", message: chatInput.trim() }])
    setChatInput("")

    setTimeout(() => {
      setChatHistory((prevHistory) => [...prevHistory, { sender: "tutor", message: "Thanks for your message! I'll get back to you soon." }])
    }, 1000)
  }

  const sendCalendarInvite = async (tutor, date, startTimeStr, endTimeStr) => {
    try {
      const startDateTime = new Date(date);
      const [startHours, startMinutes] = startTimeStr.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const endDateTime = new Date(date);
      const [endHours, endMinutes] = endTimeStr.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

      const response = await fetch('http://localhost/TutorMatch/server/calendar/calendar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          tutorEmail: tutor.email,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          summary: `Tutoring Session with ${tutor.name}`,
          description: `Tutoring session for ${tutor.subjects.join(', ')}`,
          tutorName: tutor.name
        })
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, eventLink: result.eventLink };
      } else if (result.redirect) {
        const authWindow = window.open(result.redirect, "googleAuth", "width=600,height=600");

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
  }

  return <div className="inbox-container">{/* UI goes here */}</div>
}

export default Inbox;
