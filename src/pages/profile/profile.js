import Card from "../../components/card/card";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from "react";
import "./profile.css";

function Profile({ userProfile }) {
  const [role, setRole] = useState("Tutee");
  //const [subject, setSubject] = useState("");
  //const [subjects, setSubjects] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null); // State to store photo data
  //const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {}, []);

  const getYearOfStudyString = (year) => {
    switch (year) {
      case 1:
        return "1st Year"
      case 2:
        return "2nd Year"
      case 3:
        return "3rd Year"
      case 4:
        return "4th Year"
      case 5:
        return "5th Year"
      default:
        return "N/A"
    }
  } 

  return (
    <div className="Profile">
     

      <Card>
        <ProfilePhotoBlock
          initialPhoto={profilePhoto} // Pass initial photo
          onPhotoChange={setProfilePhoto} // Pass callback
          userProfile={userProfile}
        />
      </Card>

      <Card>
        <div className="toggleWrapper">
          <div
            className={`toggleSwitch ${role === "Tutor" ? "tutor" : "tutee"}`}
            onClick={() => setRole(role === "Tutee" ? "Tutor" : "Tutee")}>
            <div className="toggleThumb">{role}</div>
          </div>
        </div>

        <h1> User Details</h1>
        <div className="user-details">
          <p>Email: {userProfile.email}</p>
          <p>Date Of Birth: {userProfile.dob}</p>
          <p>MacID: {userProfile.macid}</p>
          <p>Student Number: {userProfile.student_number}</p>
          <p>Year: {getYearOfStudyString(userProfile.year_of_study)} </p>
          <button >Edit Profile</button>
        </div>

      </Card>
    </div>
  );
}

export default Profile;



//preferred days selector
{/* <div className="days-grid">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${
                      selectedDays.includes(day) ? "selected" : ""
                    }`}
                    onClick={() => {
                      const newSelectedDays = selectedDays.includes(day)
                        ? selectedDays.filter((d) => d !== day)
                        : [...selectedDays, day];
                      setSelectedDays(newSelectedDays);
                    }}>
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div> */}