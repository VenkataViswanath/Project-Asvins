import React from 'react';
import "../css/Dashboard.css";
import "../css/Profile.css";

function Appointment({ time, date, doctor, address, photo}) {
    return (
        <div className="block-appt" style={{margin: '20px'}}>
            <div className='appt-date'>
                <p>{date}</p>
                <p>{time}</p>
            </div>
            <div>
            <div className="profile-card">
                <img src={photo} alt="Doctor Profile Image" className="profile-picture"/>
                <div className="profile-info">
                    <div className="profile-name">Appointment with {doctor}</div>
                    <div className="profile-description">{address}</div>
                </div>
            </div>
            </div>
        </div>
    );
}
export default Appointment;