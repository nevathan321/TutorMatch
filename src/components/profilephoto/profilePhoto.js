/**
 * File: profilePhoto.jsx
 * Group: WebFusion
 * Group Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * This component renders the profile photo section for a user's profile page.
 * It supports uploading a new image, deleting the current image, and falling back to a default avatar.
 * The selected image is read using FileReader and passed to the parent component via a callback.
 */

import profile from '../../images/profile.png';
import './profilePhoto.css';
import { useState, useEffect } from 'react';

/**
 * Displays and manages the profile photo upload block.
 * Allows users to upload a custom image or revert to the default.
 *
 * @param {string} initialPhoto - The initial photo to display (base64 or URL).
 * @param {function} onPhotoChange - Callback to notify parent of image changes.
 * @param {object} userProfile - User profile object containing saved profile photo.
 * @returns {JSX.Element} The rendered profile photo component.
 */

function ProfilePhotoBlock({ initialPhoto, onPhotoChange, userProfile }) {
    // Initialize with default profile image
    const [imageSrc, setImageSrc] = useState(profile);

    useEffect(() => {
        // Use the explicitly passed photo
        if (initialPhoto && initialPhoto !== profile) {
            setImageSrc(initialPhoto);
        } 
        // Fall back to userProfile's photo
        else if (userProfile?.profilePhoto) {
            setImageSrc(userProfile.profilePhoto);
        }
        // Default image
        else {
            setImageSrc(profile);
        }
    }, [initialPhoto, userProfile]);

    /**
     * Uploads a new profile photo by reading the selected file as a base64 string.
     * Updates the displayed image and notifies the parent component.
     *
     * @param {Event} event - The file input change event.
     */
    function uploadPhoto(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = function () {
            setImageSrc(reader.result);
            onPhotoChange(reader.result); // Notify parent component
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    /**
     * Deletes the currently uploaded photo and resets to the default image.
     * Notifies the parent component about the change.
     */

    function deletePhoto() {
        setImageSrc(profile);
        onPhotoChange(profile); // Notify parent component
    }

    /**
     * Simulates a click on the hidden file input element to trigger photo selection.
     */
    function triggerFileInput() {
        document.getElementById('fileInput').click();
    }

    /**
     * Handles profile image load errors by reverting to the default image.
     * Also notifies the parent component of the fallback.
     */
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
                <h2>Change Profile Icon</h2>
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
