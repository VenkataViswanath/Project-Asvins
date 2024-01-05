import React from 'react';
import "../css/Dashboard.css";
import logo from "../images/heart_logo.svg";
import Profile from "./Profile-Preview";
import {Link, useNavigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function Sidebar({user}) {
    
    const { logOut } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
          logOut();
          navigate("/");
        } catch(err) {
          console.error(err);
        }
      }

    return (
        <div>
            <div className='user'>
                {user.map((user, index) => (
                    <Profile key={index} {...user} />
                ))} 
            </div>

            <div className="sidebar">
            <div className="logo">
                    <img src={logo} alt="Asvins" />
                    <div className="logo-text">asvins</div>
            </div>
            
            <ul className="sidebar-items">
                <li><Link to="/patient-dashboard">Health</Link></li>
                <li><Link to="/patient-dashboard/appointments">Appointments</Link></li>
                <li><Link to="/patient-dashboard/chat">Chat</Link></li>
                <li><Link to="/patient-dashboard/doctors">Doctors</Link></li>
                <li><Link to="/patient-dashboard/insurance-providers">Insurance</Link></li>
                <button className='logout' onClick={handleLogout} style={{backgroundColor: '#e40000'}}>Logout</button>
            </ul>
            </div>
        </div>
    );
      }
  
export default Sidebar;