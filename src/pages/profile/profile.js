import Card from "../../components/card/card";
import profile from "../../images/profile.png";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from 'react';
import './profile.css';

function Profile({ userProfile }) {
    const [role, setRole] = useState(userProfile?.role || 'Tutee');
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState(userProfile?.subjectExpertise || []);
    const [profilePhoto, setProfilePhoto] = useState(userProfile?.profilePhoto || null);
    const [selectedDays, setSelectedDays] = useState(userProfile?.preferredDays || []);

    function checkPassword() {
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            document.getElementById('warning').innerHTML = "Passwords do not match";
            return false;
        } else {
            document.getElementById('warning').innerHTML = "";
            return true;
        }
    }

    const handleSubjectKeyDown = (e) => {
        if (e.key === 'Enter' && subject.trim()) {
            e.preventDefault();
            if (!subjects.includes(subject.trim())) {
                setSubjects([...subjects, subject.trim()]);
                setSubject('');
            }
        }
    };

    const removeSubject = (index) => {
        setSubjects(subjects.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (role === 'Tutor') {
            document.querySelector('.TutorDetails').style.display = 'block';
        } else {
            document.querySelector('.TutorDetails').style.display = 'none';
        }
    }, [role]);

    useEffect(() => {
        if (userProfile) {
            // Fill basic fields
            document.getElementById('fname').value = userProfile.firstName || '';
            document.getElementById('lname').value = userProfile.lastName || '';
            document.getElementById('macId').value = userProfile.macId || '';
            document.getElementById('studentNumber').value = userProfile.studentNumber || '';
            
            // Fill tutor-specific fields if user is a tutor
            if (userProfile.role === 'Tutor' && document.getElementById('hourlyRate')) {
                document.getElementById('hourlyRate').value = userProfile.hourlyRate || '';
            }
        }
    }, [userProfile]);

    function saveProfileData(e) {
        e.preventDefault();
    
        // TODO: Change to interact with DOM, not alerts
        if (!checkPassword()) {
            alert("Passwords don't match!");
            return;
        }
    
        const email = userProfile.email;
    
        const profileData = {
            role,
            firstName: document.getElementById('fname').value,
            lastName: document.getElementById('lname').value,
            macId: document.getElementById('macId').value,
            studentNumber: document.getElementById('studentNumber').value,
            hourlyRate: role === 'Tutor' ? document.getElementById('hourlyRate').value : null,
            preferredDays: role === 'Tutor' ? selectedDays : [],
            subjectExpertise: role === 'Tutor' ? subjects : [],
            password: document.getElementById('password').value,
            profilePhoto: profilePhoto || null,
            email
        };
    
        console.log("Sending to server:", profileData); // Log what we're sending
    
        fetch('http://localhost/tutormatch/server/profile/createProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        })
        .then(async response => {
            // Get raw response text regardless of content type
            const responseText = await response.text();
    
            // Try to parse as JSON
            try {
                const data = JSON.parse(responseText);               
                return data;
            } catch (error) {
                console.error("Failed to parse JSON. Raw response was:", responseText);
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        })
        .then(data => {
            if (data.success) {
                alert('Profile updated successfully!');
                console.log("Server response data:", data);
                window.location.reload();
            } else {
                alert('Failed to update profile: ' + (data.message || 'Unknown error'));
                console.warn("Server reported failure:", data);
            }
        })
        .catch(err => {
            console.error("Full error details:", {
                error: err,
                message: err.message,
                stack: err.stack
            });
        });
    }

    return (
        <div className='Profile'>
            <div className='top'>
                <h1> Edit Profile </h1>
            </div>

            <Card>
                <ProfilePhotoBlock
                    initialPhoto={profilePhoto}
                    onPhotoChange={setProfilePhoto}
                    userProfile={userProfile}
                />
            </Card>

            <Card>
                <div className="toggleWrapper">
                    <div className={`toggleSwitch ${role === 'Tutor' ? 'tutor' : 'tutee'}`} onClick={() => setRole(role === 'Tutee' ? 'Tutor' : 'Tutee')}>
                        <div className="toggleThumb">{role}</div>
                    </div>
                </div>

                <h1> User Details</h1>
                <form className="userDetails">
                    <div className='userContainer'>
                        <label htmlFor='fname'>First Name:</label>
                        <input type='text' id='fname' name='fname' placeholder='First Name' required />

                        <label htmlFor='lname'>Last Name:</label>
                        <input type='text' id='lname' name='lname' placeholder='Last Name' required />
                    </div>

                    <div className="userContainer">
                        <label htmlFor='macId'>McMaster ID:</label>
                        <input type='text' id='macId' name='macId' placeholder='macId' required />

                        <label htmlFor='studentNumber'>Student Number:</label>
                        <input type='number' id='studentNumber' name='studentNumber' placeholder='Student Number' required />
                    </div>

                    <div className="TutorDetails">
                        <div className="formGroup">
                            <label htmlFor='hourlyRate'>Hourly Rate</label>
                            <input style={{ width: '50%' }} type='number' id='hourlyRate' name='hourlyRate' placeholder='10' required />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="preferredDays">Preferred Days</label>
                            <div className="days-grid">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`day-button ${selectedDays.includes(day) ? "selected" : ""}`}
                                        onClick={() => {
                                            const newSelectedDays = selectedDays.includes(day)
                                                ? selectedDays.filter((d) => d !== day)
                                                : [...selectedDays, day];
                                            setSelectedDays(newSelectedDays);
                                        }}
                                    >
                                        {day.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="formGroup">
                            <label htmlFor='subjectExpertise'>Subject Expertise</label>
                            <input
                                style={{ width: '50%' }}
                                type='text'
                                id='subjectExpertise'
                                name='subjectExpertise'
                                placeholder='Add a subject and press Enter'
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                onKeyDown={handleSubjectKeyDown}
                            />
                        </div>

                        <div className="tagsContainer">
                            {subjects.map((subj, idx) => (
                                <span key={idx} className="tag">
                                    {subj}
                                    <button type="button" className="removeTag" onClick={() => removeSubject(idx)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <label htmlFor='password'>Password:</label>
                    <input onInput={checkPassword} style={{ width: '50%' }} type='password' id='password' name='password' placeholder='Password' required />

                    <label htmlFor='confirmPassword'>Confirm Password:</label>
                    <input onInput={checkPassword} style={{ width: '50%' }} type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' required />
                    <p style={{ color: "red" }} id="warning"> </p>

                    <div className="buttonGroup">
                        <button className="btn delete" type="reset"> Cancel</button>
                        <button className="btn" type='submit' onClick={saveProfileData}>Update</button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default Profile;
