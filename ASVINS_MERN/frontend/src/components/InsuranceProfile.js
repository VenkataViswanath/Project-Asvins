import React from 'react';
import "../css/Profile.css";
import Chat from "../images/chat.svg";


function InsuranceProfile({ image, name = 'Unknown', email = 'Unknown Email'}) {
  return (
    <div className="profile-card-doc">
        <img src={image} alt="Profile Picture" className="profile-picture"/>
        <div className="profile-info">
            <div className="profile-name">{name}</div>
            <div className="profile-description">
                <div className="icon">
                    <img src={Chat} />
                </div>
                {email}
            </div>
        </div>
    </div>
  );
}

export default InsuranceProfile;
