import React from 'react';
import "../css/Dashboard.css";
import logo from "../images/heart_logo.svg";
import Profile from "./Profile-Preview";
import {Link, useNavigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const InsuranceProviderSidebar = ({user}) => {
    // Leaving this commenting in case you need it here
    // const {user} = UserAuth();
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
                <li><Link to="/InsuranceProviderDashboard">Home</Link></li>
                <li><Link to="/InsuranceProviderDashboard/policies">Policy Packages and Management</Link></li>
                <li><Link to="/InsuranceProviderDashboard/claimsManagment">Claims Management</Link></li>
                <li><Link to="/InsuranceProviderDashboard/chat">Chat</Link></li>
                <li><Link to="/InsuranceProviderDashboard/doctors">Doctors</Link></li>
                <button className='logout' onClick={handleLogout} style={{backgroundColor: '#e40000'}}>Logout</button>
            </ul>
            </div>
        </div>
    );
      }
  
export default InsuranceProviderSidebar;