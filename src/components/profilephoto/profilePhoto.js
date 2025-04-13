import profile from '../../images/profile.png';
import './profilePhoto.css';
import { useState } from 'react';

function ProfilePhotoBlock({ onPhotoChange }) {
    const [imageSrc, setImageSrc] = useState(profile);

    function uploadPhoto(event){
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = function(){
            setImageSrc(reader.result);
            onPhotoChange(reader.result); // Notify parent component
        }

        if(file){
            reader.readAsDataURL(file);
        }
    }

    function deletePhoto(){
        setImageSrc(profile);
        onPhotoChange(profile); // Notify parent component
    }

    function triggerFileInput() {
        document.getElementById('fileInput').click();
    }

    function handleImageError() {
        setImageSrc(profile); // Reset to default profile image on error
        onPhotoChange(profile); // Notify parent component
    }

    return (
        <div className="profile-photo">
            <img 
                className="image" 
                src={imageSrc} 
                alt="Profile" 
                onError={handleImageError} 
            />
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
