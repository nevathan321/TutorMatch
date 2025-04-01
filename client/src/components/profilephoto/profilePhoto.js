import profile from '../../images/profile.png';
import './profilePhoto.css';

function ProfilePhotoBlock() {
    return (
        <div className="profile-photo">
            <img className="image" src={profile} alt="Profile" />
            <div className="profile-header">
                <h2>John Doe</h2>
                <p>Email: liyuxiao2@gmail.com</p>
                <div className="options">
                    <button className="btn">Upload Photo</button>
                    <button className="btn delete">Delete Photo</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePhotoBlock;
