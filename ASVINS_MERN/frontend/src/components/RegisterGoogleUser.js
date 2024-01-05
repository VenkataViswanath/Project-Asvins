import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import "../css/Register.css";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const RegisterGoogleUser = () => {

    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    
    const { user } = UserAuth();
    console.log("User");
    console.log(user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(phone !== '') {
            let apiUrl = '/api/v1/patients/createPatient'; // Default API endpoint
            
            console.log('http://localhost:3000'+ apiUrl);

            // POSTING FORM DATA ------------------------------
            const response = await fetch('http://localhost:3000'+ apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({  fullname: user.displayName,
                                        emailid: user.email,
                                        phone: phone,
                                        password: "#pa!ss#wo!rd$",})
            })

            console.log(response);
            const json = response.json();
            console.log(json);
            if(!response.ok){
                alert("User is already registered. Please log in.");
                console.log(json.error);
            } else {
                navigate("/patient-dashboard");
            }
        }
    }

    return (
        <div className="content">
        <form onSubmit={handleSubmit}>
            <input
                type="phone"
                name="phone"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <button variant="primary" type="submit" className="button" style={{ marginBottom: '10px' }}>Login</button>
        </form>
        </div>
    );
}

export default RegisterGoogleUser;