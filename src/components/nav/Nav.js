import './Nav.css';
import profile from '../../images/profile.png';
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
                    <h4 style={{color:"grey"}}>Tutor Match</h4>
                </div>

                <div className='sect' onClick = {() => navigate("/")}>
                    <img src={home} alt="Match" />
                    <p>Dashboard</p>
                </div>
            
                <div className='sect' onClick = {() => navigate("/match")}>
                    <img src={home} alt="Match" />
                    <p>Match</p>
                </div>

                <div className='sect' onClick = {() => navigate("/inbox")}>
                    <img src={folder} alt="Folder" />
                    <p>Inbox</p>
                </div>
                <div className='sect' onClick = {() => navigate("/profile")}>
                    <img src={profile} alt="Tag" onClick = {() => navigate("/profile")}/>
                    <p>Profile</p>
                </div>
        </div>
    )
}

export default Nav;