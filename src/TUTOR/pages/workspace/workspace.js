"use client"

import { useState, useEffect } from "react"
import "./workspace.css"
import Card from "../../../components/card/card"
import {
  FaPlus,
  FaSearch,
  FaFile,
  FaFilePdf,
  FaFileAlt,
  FaFileImage,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaSave,
  FaTimes,
  FaLink,
} from "react-icons/fa"
import ToastContainer from "../../../components/ToastContainer/ToastContainer"

function TutorWorkspace() {
  const [activeTab, setActiveTab] = useState("materials")
  const [resources, setResources] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResource, setSelectedResource] = useState(null)
  const [showResourceForm, setShowResourceForm] = useState(false)
  const [resourceName, setResourceName] = useState("")
  const [resourceType, setResourceType] = useState("file")
  const [resourceLink, setResourceLink] = useState("")
  const [resourceNotes, setResourceNotes] = useState("")
  const [resourceSubject, setResourceSubject] = useState("")
  const [subjects, setSubjects] = useState([
    "Mathematics",
    "Physics",
    "Computer Science",
    "English Literature",
    "Chemistry",
    "Biology",
    "History",
  ])

  // Session planning states
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [sessionDate, setSessionDate] = useState("")
  const [sessionStudent, setSessionStudent] = useState("")
  const [sessionSubject, setSessionSubject] = useState("")
  const [sessionNotes, setSessionNotes] = useState("")
  const [sessionObjectives, setSessionObjectives] = useState("")
  const [sessionMaterials, setSessionMaterials] = useState("")

  // Mock data for resources
  useEffect(() => {
    setResources([
      {
        id: 1,
        name: "Calculus Cheat Sheet",
        type: "pdf",
        subject: "Mathematics",
        notes: "Key formulas and concepts for calculus",
        dateAdded: "2023-04-10",
      },
      {
        id: 2,
        name: "Physics Formulas",
        type: "pdf",
        subject: "Physics",
        notes: "Comprehensive list of physics equations",
        dateAdded: "2023-04-05",
      },
      {
        id: 3,
        name: "Programming Tutorial",
        type: "link",
        subject: "Computer Science",
        notes: "Great tutorial for teaching Python basics",
        link: "https://example.com/python-tutorial",
        dateAdded: "2023-04-15",
      },
      {
        id: 4,
        name: "Essay Structure Guide",
        type: "doc",
        subject: "English Literature",
        notes: "Use this to help students structure essays properly",
        dateAdded: "2023-04-08",
      },
      {
        id: 5,
        name: "Chemical Reactions Diagram",
        type: "image",
        subject: "Chemistry",
        notes: "Visual aid for explaining reaction types",
        dateAdded: "2023-04-12",
      },
    ])

    // Mock data for sessions
    setSessions([
      {
        id: 1,
        date: "2023-04-20",
        student: "Alex Johnson",
        subject: "Mathematics",
        objectives: "Cover derivatives and basic integration",
        materials: "Calculus textbook, practice problems",
        notes: "Alex struggles with visualization - bring extra diagrams",
      },
      {
        id: 2,
        date: "2023-04-22",
        student: "Sarah Williams",
        subject: "English Literature",
        objectives: "Review essay structure and thesis development",
        materials: "Essay examples, outline template",
        notes: "Focus on helping Sarah develop stronger thesis statements",
      },
      {
        id: 3,
        date: "2023-04-25",
        student: "Michael Brown",
        subject: "Computer Science",
        objectives: "Introduce arrays and basic algorithms",
        materials: "Code examples, practice problems",
        notes: "Michael learns best with hands-on coding exercises",
      },
    ])
  }, [])

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSessions = sessions.filter(
    (session) =>
      session.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddResource = () => {
    resetResourceForm()
    setShowResourceForm(true)
  }

  const handleEditResource = (resource) => {
    setSelectedResource(resource)
    setResourceName(resource.name)
    setResourceType(resource.type)
    setResourceLink(resource.link || "")
    setResourceNotes(resource.notes)
    setResourceSubject(resource.subject)
    setShowResourceForm(true)
  }

  const handleDeleteResource = (id) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      setResources(resources.filter((resource) => resource.id !== id))
    }
  }

  const resetResourceForm = () => {
    setSelectedResource(null)
    setResourceName("")
    setResourceType("file")
    setResourceLink("")
    setResourceNotes("")
    setResourceSubject("")
  }

  const saveResource = () => {
    if (!resourceName || !resourceSubject) return

    if (selectedResource) {
      // Update existing resource
      const updatedResources = resources.map((resource) =>
        resource.id === selectedResource.id
          ? {
              ...resource,
              name: resourceName,
              type: resourceType,
              link: resourceType === "link" ? resourceLink : undefined,
              notes: resourceNotes,
              subject: resourceSubject,
            }
          : resource,
      )
      setResources(updatedResources)
    } else {
      // Add new resource
      const newResource = {
        id: resources.length + 1,
        name: resourceName,
        type: resourceType,
        link: resourceType === "link" ? resourceLink : undefined,
        notes: resourceNotes,
        subject: resourceSubject,
        dateAdded: new Date().toISOString().split("T")[0],
      }
      setResources([...resources, newResource])
    }

    setShowResourceForm(false)
    resetResourceForm()
  }

  const handleAddSession = () => {
    resetSessionForm()
    setShowSessionForm(true)
  }

  const handleEditSession = (session) => {
    setSelectedSession(session)
    setSessionDate(session.date)
    setSessionStudent(session.student)
    setSessionSubject(session.subject)
    setSessionObjectives(session.objectives)
    setSessionMaterials(session.materials)
    setSessionNotes(session.notes)
    setShowSessionForm(true)
  }

  const handleDeleteSession = (id) => {
    if (confirm("Are you sure you want to delete this session plan?")) {
      setSessions(sessions.filter((session) => session.id !== id))
    }
  }

  const resetSessionForm = () => {
    setSelectedSession(null)
    setSessionDate("")
    setSessionStudent("")
    setSessionSubject("")
    setSessionObjectives("")
    setSessionMaterials("")
    setSessionNotes("")
  }

  const saveSession = () => {
    if (!sessionDate || !sessionStudent || !sessionSubject) return

    if (selectedSession) {
      // Update existing session
      const updatedSessions = sessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              date: sessionDate,
              student: sessionStudent,
              subject: sessionSubject,
              objectives: sessionObjectives,
              materials: sessionMaterials,
              notes: sessionNotes,
            }
          : session,
      )
      setSessions(updatedSessions)
    } else {
      // Add new session
      const newSession = {
        id: sessions.length + 1,
        date: sessionDate,
        student: sessionStudent,
        subject: sessionSubject,
        objectives: sessionObjectives,
        materials: sessionMaterials,
        notes: sessionNotes,
      }
      setSessions([...sessions, newSession])
    }

    setShowSessionForm(false)
    resetSessionForm()
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FaFilePdf className="resource-icon pdf" />
      case "doc":
      case "docx":
        return <FaFileAlt className="resource-icon doc" />
      case "image":
      case "png":
      case "jpg":
        return <FaFileImage className="resource-icon image" />
      case "link":
        return <FaLink className="resource-icon link" />
      default:
        return <FaFile className="resource-icon" />
    }
  }

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="workspace-container">
      <ToastContainer />

      <div className="workspace-header">
        <h1>Tutor Workspace</h1>
        <p>Organize your teaching materials and plan your sessions</p>
      </div>

      <div className="workspace-tabs">
        <button className={activeTab === "materials" ? "active" : ""} onClick={() => setActiveTab("materials")}>
          Teaching Materials
        </button>
        <button className={activeTab === "sessions" ? "active" : ""} onClick={() => setActiveTab("sessions")}>
          Session Plans
        </button>
      </div>

      <div className="workspace-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={activeTab === "materials" ? "Search materials..." : "Search session plans..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="add-btn" onClick={activeTab === "materials" ? handleAddResource : handleAddSession}>
          <FaPlus /> {activeTab === "materials" ? "Add Material" : "Add Session Plan"}
        </button>
      </div>

      {activeTab === "materials" && (
        <div className="materials-grid">
          {filteredResources.length === 0 ? (
            <div className="empty-state">
              <p>No teaching materials found. Add your first material by clicking "Add Material".</p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <Card key={resource.id} className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon-container">{getResourceIcon(resource.type)}</div>
                  <div className="resource-actions">
                    <button className="edit-btn" onClick={() => handleEditResource(resource)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteResource(resource.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="resource-content">
                  <h3 className="resource-name">{resource.name}</h3>
                  <div className="resource-subject">{resource.subject}</div>
                  <p className="resource-notes">{resource.notes}</p>
                  <div className="resource-date">Added: {resource.dateAdded}</div>
                  {resource.link && (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                      View Resource
                    </a>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="sessions-list">
          {filteredSessions.length === 0 ? (
            <div className="empty-state">
              <p>No session plans found. Add your first session plan by clicking "Add Session Plan".</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <Card key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-date">
                    <FaCalendarAlt className="calendar-icon" />
                    {formatDate(session.date)}
                  </div>
                  <div className="session-actions">
                    <button className="edit-btn" onClick={() => handleEditSession(session)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteSession(session.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="session-content">
                  <div className="session-info">
                    <h3 className="session-student">{session.student}</h3>
                    <div className="session-subject">{session.subject}</div>
                  </div>

                  <div className="session-details">
                    <div className="session-section">
                      <h4>Objectives</h4>
                      <p>{session.objectives}</p>
                    </div>

                    <div className="session-section">
                      <h4>Materials</h4>
                      <p>{session.materials}</p>
                    </div>

                    <div className="session-section">
                      <h4>Notes</h4>
                      <p>{session.notes}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Resource Form Modal */}
      {showResourceForm && (
        <div className="modal-overlay" onClick={() => setShowResourceForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedResource ? "Edit Material" : "Add New Material"}</h2>

            <div className="form-group">
              <label>Material Name</label>
              <input
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="Enter material name"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                <option value="file">File</option>
                <option value="pdf">PDF</option>
                <option value="doc">Document</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
              </select>
            </div>

            {resourceType === "link" && (
              <div className="form-group">
                <label>Link URL</label>
                <input
                  type="text"
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  placeholder="https://example.com/resource"
                />
              </div>
            )}

            <div className="form-group">
              <label>Subject</label>
              <select value={resourceSubject} onChange={(e) => setResourceSubject(e.target.value)}>
                <option value="">Select a subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={resourceNotes}
                onChange={(e) => setResourceNotes(e.target.value)}
                placeholder="Add notes about this material"
              ></textarea>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowResourceForm(false)}>
                <FaTimes /> Cancel
              </button>
              <button className="save-btn" onClick={saveResource} disabled={!resourceName || !resourceSubject}>
                <FaSave /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Form Modal */}
      {showSessionForm && (
        <div className="modal-overlay" onClick={() => setShowSessionForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedSession ? "Edit Session Plan" : "Add New Session Plan"}</h2>

            <div className="form-group">
              <label>Date</label>
              <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                value={sessionStudent}
                onChange={(e) => setSessionStudent(e.target.value)}
                placeholder="Enter student name"
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select value={sessionSubject} onChange={(e) => setSessionSubject(e.target.value)}>
                <option value="">Select a subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Session Objectives</label>
              <textarea
                value={sessionObjectives}
                onChange={(e) => setSessionObjectives(e.target.value)}
                placeholder="What do you plan to cover in this session?"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Materials Needed</label>
              <textarea
                value={sessionMaterials}
                onChange={(e) => setSessionMaterials(e.target.value)}
                placeholder="What materials will you need for this session?"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Any additional notes about the student or session"
              ></textarea>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowSessionForm(false)}>
                <FaTimes /> Cancel
              </button>
              <button
                className="save-btn"
                onClick={saveSession}
                disabled={!sessionDate || !sessionStudent || !sessionSubject}
              >
                <FaSave /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TutorWorkspace
