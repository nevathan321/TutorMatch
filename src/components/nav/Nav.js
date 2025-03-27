import './Nav.css';
import profile from '../../images/profile.png';
import gear from '../../images/gear.png';
import placeholder from '../../images/placeholder.png';
import home from '../../images/home.png';
import folder from '../../images/folder.png';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    return (
        <div className='Nav'>
                <div className='top'>
                    <img src={placeholder} alt="Logo" />
                    <p>Tutor Match</p>
                </div>


                <nav className='toolbar'>
                    <img src={profile} alt="profile" onClick = {() => navigate("/profile")}/>
                    <img src={gear} alt="Settings" onClick = {() => navigate("/settings")}/>
                </nav>

                <div className='sect'>
                    <img src={home} alt="Match" onClick = {() => navigate("/match")}/>
                    <p>Match</p>
                </div>
                <div className='sect'>
                    <img src={folder} alt="Folder" onClick = {() => navigate("/inbox")}/>
                    <p>Inbox</p>
                </div>
                <div className='sect'>
                    <img src={profile} alt="Tag" onClick = {() => navigate("/profile")}/>
                    <p>Profile</p>
                </div>
        </div>
    )
}

export default Nav;