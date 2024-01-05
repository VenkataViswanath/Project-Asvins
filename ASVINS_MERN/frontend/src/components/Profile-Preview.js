import React from 'react';
import "../css/Profile.css";
import { Link } from 'react-router-dom';

function Profile_Preview({ image, name, title, profile_link }) {
  return (
    <Link to={profile_link}>
    <div className="profile-card">
        <img src={image} alt="Profile Picture" className="profile-picture"/>
        <div className="profile-info">
            <div className="profile-name">{name}</div>
            <div className="profile-description">{title}</div>
        </div>
    </div>
    </Link>
  );
}

export default Profile_Preview;
