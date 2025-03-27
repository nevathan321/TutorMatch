import Card from "../../components/card/card";
import ProfilePhotoBlock from "../../components/profilephoto/profilePhoto";
import './profile.css';

function Profile(){
    return(
        <div className='Profile'>
            <div className='top'>
                <h1> Edit Profile </h1>
            </div>

            <Card>
                <ProfilePhotoBlock />
            </Card>

            <Card>
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
                    
                    <label for='password'>Password:</label>
                    <input  style={{ width: '50%' }} type='password' id='password' name='password' placeholder='Password' required></input>

                    <label for='confirmPassword'>Confirm Password:</label>
                    <input style={{ width: '50%' }} type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' required></input>

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