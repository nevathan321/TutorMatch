import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from "react";
import "./profile.css";

function Profile({ userProfile }) {
  const [role, setRole] = useState("Tutee");
  const [profilePhoto, setProfilePhoto] = useState(null); // State to store photo data

  useEffect(() => {}, []);

  return (
    <div className="Profile">
      <div className="card">
        <ProfilePhotoBlock
          initialPhoto={profilePhoto} // Pass initial photo
          onPhotoChange={setProfilePhoto} // Pass callback
          userProfile={userProfile}
        />
      </div>

      <div className="card">
        <div className="toggleWrapper">
          <div
            className={`toggleSwitch ${role === "Tutor" ? "tutor" : "tutee"}`}
            onClick={() => setRole(role === "Tutee" ? "Tutor" : "Tutee")}
          >
            <div className="toggleThumb">{role}</div>
          </div>
        </div>

        <h1>User Details</h1>
        <div className="user-details">
          <p>Email: {userProfile.email}</p>
          <p>Date Of Birth: {userProfile.dob}</p>
          <p>MacID: {userProfile.macid}</p>
          <p>Student Number: {userProfile.student_number}</p>
          <button>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;