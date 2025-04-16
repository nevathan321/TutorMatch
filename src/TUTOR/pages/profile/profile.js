"use client"

import { useState, useEffect } from "react"
import "./profile.css"
import Card from "../../../components/card/card"
import ProfilePhoto from "../../../components/profilephoto/profilePhoto"
import ToastContainer from "../../../components/ToastContainer/ToastContainer"

function Profile() {
  const [role, setRole] = useState("Tutee")
  const [subject, setSubject] = useState("")
  const [subjects, setSubjects] = useState([])
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [selectedDays, setSelectedDays] = useState([])
  const [education, setEducation] = useState("")
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")

  function checkPassword() {
    var password = document.getElementById("password").value
    var confirmPassword = document.getElementById("confirmPassword").value

    if (password !== confirmPassword) {
      document.getElementById("warning").innerHTML = "Passwords do not match"
      return false
    } else {
      document.getElementById("warning").innerHTML = ""
      return true
    }
  }

  const handleSubjectKeyDown = (e) => {
    if (e.key === "Enter" && subject.trim()) {
      e.preventDefault()
      if (!subjects.includes(subject.trim())) {
        setSubjects([...subjects, subject.trim()])
        setSubject("")
      }
    }
  }

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  useEffect(() => {
    // Load profile data from localStorage or API
    const storedData = localStorage.getItem("profileData")
    if (storedData) {
      const profileData = JSON.parse(storedData)
      console.log("Loaded profile data:", profileData)

      const fnameInput = document.getElementById("fname")
      const lnameInput = document.getElementById("lname")
      const macIdInput = document.getElementById("macId")
      const studentNumberInput = document.getElementById("studentNumber")
      const passwordInput = document.getElementById("password")
      const confirmPasswordInput = document.getElementById("confirmPassword")
      const educationInput = document.getElementById("education")
      const bioInput = document.getElementById("bio")
      const hourlyRateInput = document.getElementById("hourlyRate")

      if (fnameInput) fnameInput.value = profileData.firstName || ""
      if (lnameInput) lnameInput.value = profileData.lastName || ""
      if (macIdInput) macIdInput.value = profileData.macId || ""
      if (studentNumberInput) studentNumberInput.value = profileData.studentNumber || ""
      if (passwordInput) passwordInput.value = profileData.password || ""
      if (confirmPasswordInput) confirmPasswordInput.value = profileData.password || ""
      if (educationInput) setEducation(profileData.education || "")
      if (bioInput) setBio(profileData.bio || "")
      if (hourlyRateInput) setHourlyRate(profileData.hourlyRate || "")

      setRole(profileData.role || "Tutor")
      setSubjects(profileData.subjectExpertise || [])
      setSelectedDays(profileData.preferredDays || [])
      setProfilePhoto(profileData.profilePhoto || null)
    }
  }, [])

  function saveProfileData(e) {
    e.preventDefault()

    const profileData = {
      role,
      firstName: document.getElementById("fname").value,
      lastName: document.getElementById("lname").value,
      macId: document.getElementById("macId").value,
      studentNumber: document.getElementById("studentNumber").value,
      hourlyRate,
      preferredDays: selectedDays,
      subjectExpertise: subjects,
      password: document.getElementById("password").value,
      education,
      bio,
      profilePhoto,
    }

    console.log("Saving profile data:", profileData)
    localStorage.setItem("profileData", JSON.stringify(profileData))
    alert("Profile updated successfully!")
  }

  return (
    <div className="profile-container">
      <ToastContainer />

      <div className="profile-header">
        <h1>Edit Profile</h1>
      </div>

      <Card>
        <ProfilePhoto initialPhoto={profilePhoto} onPhotoChange={setProfilePhoto} />
      </Card>

      <Card>
        <div className="role-toggle">
          <span className={role === "Tutor" ? "active" : ""}>Tutor</span>
          <div className="toggle-switch">
            <div className={`toggle-thumb ${role === "Tutor" ? "tutor" : "tutee"}`}></div>
          </div>
        </div>

        <h2>User Details</h2>
        <form className="user-details-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fname">First Name:</label>
              <input type="text" id="fname" name="fname" placeholder="First Name" required />
            </div>

            <div className="form-group">
              <label htmlFor="lname">Last Name:</label>
              <input type="text" id="lname" name="lname" placeholder="Last Name" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="macId">McMaster ID:</label>
              <input type="text" id="macId" name="macId" placeholder="macId" required />
            </div>

            <div className="form-group">
              <label htmlFor="studentNumber">Student Number:</label>
              <input type="number" id="studentNumber" name="studentNumber" placeholder="Student Number" required />
            </div>
          </div>

          <div className="tutor-details">
            <div className="form-group">
              <label htmlFor="education">Education:</label>
              <input
                type="text"
                id="education"
                name="education"
                placeholder="e.g., PhD in Physics, Stanford University"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell students about yourself, your teaching style, and expertise"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hourlyRate">Hourly Rate ($):</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                placeholder="e.g., 45"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferredDays">Preferred Days:</label>
              <div className="days-grid">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${selectedDays.includes(day) ? "selected" : ""}`}
                    onClick={() => {
                      const newSelectedDays = selectedDays.includes(day)
                        ? selectedDays.filter((d) => d !== day)
                        : [...selectedDays, day]
                      setSelectedDays(newSelectedDays)
                    }}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subjectExpertise">Subject Expertise:</label>
              <input
                type="text"
                id="subjectExpertise"
                name="subjectExpertise"
                placeholder="Add a subject and press Enter"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={handleSubjectKeyDown}
              />
            </div>

            <div className="tags-container">
              {subjects.map((subj, idx) => (
                <span key={idx} className="tag">
                  {subj}
                  <button type="button" className="remove-tag" onClick={() => removeSubject(idx)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                onInput={checkPassword}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                onInput={checkPassword}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>
          <p style={{ color: "red" }} id="warning"></p>

          <div className="button-group">
            <button className="cancel-btn" type="reset">
              Cancel
            </button>
            <button className="update-btn" type="submit" onClick={saveProfileData}>
              Update
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Profile
