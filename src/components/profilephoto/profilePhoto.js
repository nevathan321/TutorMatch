import profile from '../../images/profile.png';
import './profilePhoto.css';
import { useState } from 'react';



// Handles photo upload and sets the selected image as the profile photo.
function ProfilePhotoBlock() {
    const [imageSrc, setImageSrc] = useState(profile);

    function uploadPhoto(event){
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = function(){
            setImageSrc(reader.result);
        }

        if(file){
            reader.readAsDataURL(file);
        }
    }


    // Resets the profile photo back to the default image.
    function deletePhoto(){
        setImageSrc(profile);
    }

    // Opens the hidden file input when "Upload Photo" button is clicked.
    function triggerFileInput() {
        document.getElementById('fileInput').click();
    }

    return (
        <div className="profile-photo">
            <img className="image" src={imageSrc} alt="Profile" />
            <div className="profile-header">
                <h2>John Doe</h2>
                <p>Email: liyuxiao2@gmail.com</p>
                <div className="options">

                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={uploadPhoto}
                        style={{ display: 'none' }}
                    />

                    <button className="btn" onClick={triggerFileInput}>Upload Photo</button>
                    <button className="btn delete" onClick={deletePhoto}>Delete Photo</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePhotoBlock;
