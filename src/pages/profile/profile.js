/**
* Group Members: Nevathan,Liyu,Adrian,Abishan
* Date: April 20, 2025
* 
* Profile component for handling user profile editing and updates.
* Manages user details, profile photo, password changes, and form submission.
* Communicates with backend API to save profile data.
*/

import profile from "../../images/profile.png";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './profile.css';


/**
 * Renders the Profile page where users can view and update their profile information.
 * 
 * @param {Object} userProfile - The current user's profile data.
 * @param {Function} setUserProfile - Function to update the user's profile data in global state.
 * @param {Function} setIsLoggedIn - Function to update login state (used on logout).
 * @returns {JSX.Element} The profile component.
 */

function Profile({ userProfile, setUserProfile, setIsLoggedIn }) {
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        document.getElementById('warning').innerHTML = "Password fields cannot be empty";
    }, []);

    const navigate = useNavigate();
    /**
    * Initializes profile data when userProfile prop changes
    * 
    * @param {Object} userProfile - User profile data from parent component
    * @effect Sets initial form values and profile photo
    * @dependencies userProfile
    */
    useEffect(() => {
        if (userProfile) {

            setProfilePhoto(userProfile.profilePhoto || userProfile.profile_image || profile);

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

    /**
    * Displays a notification message to the user
    * 
    * @param {String} message - Notification message to display
    * @param {Boolean} isSuccess - Determines notification style (success/error)
    */

    const handleLogout = () => {//when logout button is clicked
        //clear all user information
        setUserProfile(null)
        setIsLoggedIn(false)
        localStorage.removeItem("userEmail");
        navigate("/");
    }
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
    }

    /**
    * Handles form input changes to reset notifications
    * 
    * @effect Adds event listeners to form inputs
    * @dependencies None (runs once on mount)
    */
    useEffect(() => {
        const form = document.querySelector('.userDetails');
        const notification = document.getElementById('profileNotification');
        const submitButton = document.getElementById("submit");

        const handleFormChange = () => {
            notification.classList.add('hidden');
            submitButton.disabled = false;
            submitButton.classList.remove("disabled");
        };

        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', handleFormChange);
            input.addEventListener('input', handleFormChange);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener('change', handleFormChange);
                input.removeEventListener('input', handleFormChange);
            });
        };
    }, []);

    /**
    * Resets notification when profile photo changes
    * 
    * @effect Hides notification and enables submit button
    * @dependencies profilePhoto
    */
    useEffect(() => {
        const notification = document.getElementById('profileNotification');
        const submitButton = document.getElementById("submit");

        if (notification && submitButton) {
            notification.classList.add('hidden');
            submitButton.disabled = false;
            submitButton.classList.remove("disabled");
        }
    }, [profilePhoto]);

    /**
    * Validates password and confirm password fields match
    * 
    * @returns {Boolean} True if passwords match, false otherwise
    */
    function checkPassword() {
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPassword').value;

        if (password === "" || confirmPassword === "") {
            document.getElementById('warning').innerHTML = "Password fields cannot be empty";
            return false;
        }
        if (password !== confirmPassword) {
            document.getElementById('warning').innerHTML = "Passwords do not match";
            return false;
        } else if (password.length < 8){
            document.getElementById('warning').innerHTML = "Passwords must be at least 8 characters";
        } else if (!/\d/.test(password)){
            document.getElementById('warning').innerHTML = "Passwords must contain at least 1 number";
        } else {
            document.getElementById('warning').innerHTML = "";
            return true;
        }
    }

    /**
    * Hides tutor details section on component mount
    * 
    * @effect Sets display:none for tutor details section
    * @dependencies None (runs once on mount)
    */
    useEffect(() => {
        const tutorDetails = document.querySelector('.TutorDetails');
        if (tutorDetails) {
            tutorDetails.style.display = 'none';
        }
    }, []);

    /**
    * Handles profile form submission
    * 
    * @param {Event} e - Form submit event
    * @async
    */
    function saveProfileData(e) {
        e.preventDefault();
        let errormsg = document.getElementById('warning').innerHTML;

        if (!checkPassword()) {
            showNotification(errormsg, false);
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
                showNotification(`${field.label} is required in correct format.`, false);
                return;
            }
        }

        const email = userProfile.email;

        const profileData = {
            role: 'Tutee',
            firstName: document.getElementById('fname').value,
            lastName: document.getElementById('lname').value,
            macId: document.getElementById('macId').value,
            studentNumber: document.getElementById('studentNumber').value,
            password: document.getElementById('password').value,
            profilePhoto: profilePhoto || null,
            email
        };

        fetch('https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/profile/createProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        })
            .then(async response => {
                const responseText = await response.text();
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
                    document.getElementById("fname").value = data.user_profile.first_name || "";
                    document.getElementById("lname").value = data.user_profile.last_name || "";
                    document.getElementById("macId").value = data.user_profile.macid || "";
                    document.getElementById("studentNumber").value = data.user_profile.student_number || "";

                    setProfilePhoto(data.user_profile.profile_image || profile);

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
                            profile_image: data.user_profile.profile_image,
                            email: prev.email,
                            major: prev.major,
                            ...(prev.user_type && { user_type: prev.user_type })
                        }));
                    }

                } else {
                    showNotification(`Failed to update profile: ${data.message || 'Unknown error'}`, false);
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

                    <div className="TutorDetails" style={{ display: 'none' }}></div>

                    <div className="passwords">
                        <label htmlFor='password'>New Password:</label>
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
            <div className="card">
               
                <div className="logout-btn">
                    <button onClick={handleLogout}>Logout</button>
                </div >
                  
            </div>
        </div>
    );
}

export default Profile;
