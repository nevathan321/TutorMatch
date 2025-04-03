import Card from "../../components/card/card";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from 'react';
import './profile.css';

function Profile(){
    const [role, setRole] = useState('Tutee');
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);

    function checkPassword(){
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        if(password != confirmPassword){
            document.getElementById('warning').innerHTML = "Passwords do not match";
            return false;
        }
        else{
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
    }, [role]); // Run this effect whenever `role` changes

    return(
        <div className='Profile'>
            <div className='top'>
                <h1> Edit Profile </h1>
            </div>

            <Card>
                <ProfilePhotoBlock />
            </Card>

            <Card>
                <div className="toggleWrapper">
                    <div className={`toggleSwitch ${role === 'Tutor' ? 'tutor' : 'tutee'}`} onClick={() => setRole(role === 'Tutee' ? 'Tutor' : 'Tutee')}>
                        <div className="toggleThumb">{role}</div>
                    </div>
                </div>

                <h1> User Details</h1>
                <form className = "userDetails">
                    <div className='userContainer'>
                        <label for='fname'>First Name:</label>
                        <input type='text' id='fname' name='fname' placeholder='First Name' required></input>

                        <label for='lname'>Last Name:</label>
                        <input type='text' id='lname' name='lname' placeholder='Last Name' required></input>
                    </div>

                    <div className="userContainer">
                        <label for='macId'>McMaster ID:</label>
                        <input type='text' id='macId' name='macId' placeholder='macId' required></input>

                        <label for='studentNumber'>Student Number:</label>
                        <input type='number' id='studentNumber' name='studentNumber' placeholder='Student Number' required></input>
                    </div>

                    <div className="TutorDetails"> 
                        <div className="formGroup">
                            <label for='hourlyRate'>Hourly Rate</label>
                            <input style={{ width: '50%' }} type='number' id='hourlyRate' name='hourlyRate' placeholder='10' required></input>
                        </div>

                        <div className="formGroup">
                            <label for='subjectExpertise'>Subject Expertise</label>
                            <input style={{ width: '50%' }} type='text' id='subjectExpertise' name='subjectExpertise' placeholder='Add a subject and press Enter' value={subject} onChange={(e) => setSubject(e.target.value)} onKeyDown={handleSubjectKeyDown} />
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
                    
                    
                    <label for='password'>Password:</label>
                    <input onInput={checkPassword} style={{ width: '50%' }} type='password' id='password' name='password' placeholder='Password' required></input>

                    <label for='confirmPassword'>Confirm Password:</label>
                    <input onInput={checkPassword} style={{ width: '50%' }} type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' required></input>
                    <p style = {{"color" : "red" }} id = "warning"> </p>

                    <div className="buttonGroup"> 
                        <button className = "btn delete" type = "reset"> Cancel</button>
                        <button className = "btn" type='submit'>Update</button>
                    </div>
                </form>
            </Card>
        </div>


    )
}

export default Profile;