import "../css/Profile.css";
import { Link } from 'react-router-dom';


function Insurance_Profile_Preview({ image, name, title, policy, profile_link }) {
  return (
    <Link to={profile_link}>
    <div className="profile-card">
        <img src={image} alt="Profile Picture" className="profile-picture" style={{ marginTop: '20px' }}/>
        <div className="profile-info">
            <div className="profile-name">{name}</div>
            <div className="profile-description">{title}</div>
            <div className="profile-description">{policy}</div>
        </div>
    </div>
    </Link>
      );
    }
export default Insurance_Profile_Preview;