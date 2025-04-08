import Card from "../../components/card/card";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import { useState, useEffect } from 'react';
import './Signup.css';

function Signup(){

    return(
        <div className='Signup'>
            <div className='top'>
                <h1> Enter Your Information </h1>
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
                            <label for='hourlyRate'>Additional Info</label>
                            <input style={{ width: '50%' }} type='text' id='hourlyRate' name='hourlyRate' placeholder='Enter info' required></input>
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

export default Signup;