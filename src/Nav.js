import './Nav.css';
import notif from './images/notif.png';
import profile from './images/profile.png';
import gear from './images/gear.png';
import placeholder from './images/placeholder.png';
import home from './images/home.png';
import folder from './images/folder.png';
import tag from './images/tag.png';

function Nav() {
    return (
        <div className='Nav'>
            <div className='top'>
                <img src={placeholder} alt="Logo" />
                <p>Tutor Match</p>
            </div>
            <div className='toolbar'>
                <img src={profile} alt="PFP" />
                <img src={gear} alt="Settings" />
                <img src={notif} alt="Notifications" />
            </div>
            <div className='sect'>
                <img src={home} alt="Home" />
                <p>Match</p>
            </div>
            <div className='sect'>
                <img src={folder} alt="Folder" />
                <p>Inbox</p>
            </div>
            <div className='sect'>
                <img src={tag} alt="Tag" />
                <p>Profile</p>
            </div>
        </div>
    )
}

export default Nav;