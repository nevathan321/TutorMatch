import profile from "../../images/profile.png";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from 'react';
import './profile.css';

function Profile({ userProfile, setUserProfile }) {
    // Keep only the state variables that are actually being used
    const [profilePhoto, setProfilePhoto] = useState(null);

    // useEffect to handle all initialization
    useEffect(() => {
        if (userProfile) {
            // Remove the unused setSubjects call
            setProfilePhoto(userProfile.profilePhoto || userProfile.profile_image || profile);

            // Directly set form values
            const fields = {
                fname: userProfile.firstName || userProfile.first_name || '',
                lname: userProfile.lastName || userProfile.last_name || '',
                macId: userProfile.macId || userProfile.macid || '',
                studentNumber: userProfile.studentNumber || userProfile.student_number || '',
            };

            Object.entries(fields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.value = value;
            });
        }
    }, [userProfile]);

    function showNotification(message, isSuccess) {
        const notification = document.getElementById('profileNotification');
        notification.textContent = message;
        notification.className = `profile-notification ${isSuccess ? 'success' : 'error'}`;
        document.getElementById("submit").disabled = true;
        document.getElementById("submit").classList.add("disabled");

        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }, 0);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            document.getElementById("submit").disabled = false;
            document.getElementById("submit").classList.remove("disabled");
            notification.classList.add('hidden');
        }, 5000);
    }

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

    // Hide Tutor details on initial load
    useEffect(() => {
        // Hide Tutor details completely
        const tutorDetails = document.querySelector('.TutorDetails');
        if (tutorDetails) {
            tutorDetails.style.display = 'none';
        }
    }, []);

    function saveProfileData(e) {
        e.preventDefault();

        // TODO: Change to interact with DOM, not alerts
        if (!checkPassword()) {
            showNotification("Passwords don't match!", false);
            return;
        }

        const requiredFields = [
            { id: 'fname', label: 'First Name' },
            { id: 'lname', label: 'Last Name' },
            { id: 'macId', label: 'McMaster ID' },
            { id: 'studentNumber', label: 'Student Number' },
            { id: 'password', label: 'Password' },
            { id: 'confirmPassword', label: 'Confirm Password' }
        ];
    
        for (const field of requiredFields) {
            const el = document.getElementById(field.id);
            if (!el || el.value.trim() === '') {
                showNotification(`${field.label} is required.`, false);
                return;
            }
        }

        const email = userProfile.email;

        const profileData = {
            role: 'Tutee', // Always set as Tutee
            firstName: document.getElementById('fname').value,
            lastName: document.getElementById('lname').value,
            macId: document.getElementById('macId').value,
            studentNumber: document.getElementById('studentNumber').value,
            password: document.getElementById('password').value,
            profilePhoto: profilePhoto || null,
            email
        };

        console.log("Sent to server"); // Debug

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
                    showNotification("Profile updated successfully!", true);
                    document.getElementById('confirmPassword').value = "";

                    // Update all form fields with the new data
                    document.getElementById("fname").value = data.user_profile.first_name || "";
                    document.getElementById("lname").value = data.user_profile.last_name || "";
                    document.getElementById("macId").value = data.user_profile.macid || "";
                    document.getElementById("studentNumber").value = data.user_profile.student_number || "";

                    // Update React component state
                    setProfilePhoto(data.user_profile.profile_image || profile);

                    // Update the parent component's userProfile state
                    if (typeof setUserProfile === 'function') {
                        setUserProfile(prev => ({
                            ...prev,
                            firstName: data.user_profile.first_name,
                            lastName: data.user_profile.last_name,
                            fullName: `${data.user_profile.first_name} ${data.user_profile.last_name}`,
                            macId: data.user_profile.macid,
                            studentNumber: data.user_profile.student_number,
                            role: 'Tutee',
                            profilePhoto: data.user_profile.profile_image,
                            profile_image: data.user_profile.profile_image, // Maintain both if needed
                            // Preserve any existing fields not being updated
                            email: prev.email,
                            major: prev.major,
                            ...(prev.user_type && { user_type: prev.user_type }) // Preserve if exists
                        }));
                    }

                } else {
                    showNotification(`Failed to update profile: ${data.message || 'Unknown error'}`, false);
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
            
            <div className="card">
                <ProfilePhotoBlock
                    initialPhoto={profilePhoto}
                    onPhotoChange={setProfilePhoto}
                    userProfile={userProfile}
                />
            </div>

            <div className="card">
                {/* Removed the toggle switch component */}
                
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

                    {/* Kept TutorDetails in the DOM but hidden via CSS */}
                    <div className="TutorDetails" style={{ display: 'none' }}>
                        {/* Tutor-specific fields kept but hidden */}
                    </div>
                    
                    <div className="passwords">
                        <label htmlFor='password'>Password:</label>
                        <input onInput={checkPassword} style={{ width: '50%' }} type='password' id='password' name='password' placeholder='Password' required />

                        <label htmlFor='confirmPassword'>Confirm Password:</label>
                        <input onInput={checkPassword} style={{ width: '50%' }} type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' required />
                        <p style={{ color: "red" }} id="warning"> </p>
                    </div>

                    <div className="buttonGroup">
                        <button className="btn" id="submit" type='submit' onClick={saveProfileData}>Update</button>
                    </div>
                    
                </form>
                
            </div>
            <div id="profileNotification" className="profile-notification hidden"></div>
        </div>
    )
}

export default Profile;