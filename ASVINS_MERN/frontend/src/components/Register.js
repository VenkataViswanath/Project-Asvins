import React, { useState } from "react";
import "../css/Register.css";
import Heart from "../images/heart_logo_light.svg";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import firebase from './firebaseConfig';
import { auth } from './firebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";

const Register = () => {

    const [fullname, setName] = useState('');
    const [emailid, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [profileType, setProfileType] = useState('');

    const profileOptions = [
        { value: 'patient', label: 'Patient' },
        { value: 'doctor', label: 'Doctor' },
        { value: 'insurance_provider', label: 'Insurance Provider' },
    ];

    const navigate = useNavigate();
    const { user, signUp } = UserAuth();

    // submitting the form to mongo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(emailid !== '' && fullname !== '' && password !== '') {
           
            console.log("ProfileType: ", profileType);
            // setting the profile type based on the type selected

            let apiUrl = '/api/v1/patients/createPatient'; // Default API endpoint
            // Check the value of formData.profileType and set the apiUrl accordingly
            if (profileType === 'doctor') {
                apiUrl = '/api/v1/doctors/createDoctor';
            } else if (profileType === 'insurance_provider') {
                apiUrl = '/api/v1/insuranceproviders/createInsuranceProvider';
            }
            console.log('http://localhost:3000'+ apiUrl);

            // POSTING FORM DATA ------------------------------
            const response = await fetch('http://localhost:3000'+ apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({  fullname: fullname,
                                        emailid: emailid,
                                        phone: phone,
                                        password: password,})
            })

            console.log(response);
            const json = response.json();
            console.log(json);
            if(!response.ok){
                alert("User is already registered. Please log in.");
                console.log(json.error);
            }

            // LOGGING IN THE NEW USER -----------------------------------                
            if(response.ok){
                // Firebase authentication
                try {
                    
                    const userCred = await signUp(emailid, password);
                    await sendEmailVerification(userCred.user);
                    alert("Please verify your email! A link has been sent to your email address");
                    switch(profileType) {
                        case "patient":
                            navigate("/enroll");
                            break;
                        case "doctor":
                            navigate("/enroll");
                            break;
                        case "insurance_provider":
                            navigate("/enroll");
                            break;
                        default:
                            navigate("/")
                            break;
                    }
                    // You can perform further actions after the user has been authenticated.
                    // For example, you can redirect the user to a different page.
                } catch (error) {
                    console.error('Error signing up:', error);
                }
            }

        } else {
            if(emailid === ''){
                alert('Please enter an email address');
            } else if(fullname === ''){
                alert('Please enter a name');
            } else if(password === '') {
                alert('Please enter a password');
            }
        }
    };
     
    return (
    <div className="container">
        <div id="welcomeContainer">
            <div className="heart">
                <img src={Heart} />
            </div>
            <div className="welcome">
                <h1>Welcome to Asvins</h1>
                <h3>Your new favorite healthcare management system.</h3>
                <button variant="primary" className="button">Learn more</button>
            </div>
        </div>
        <div id="helloContainer">
            <div className="hello">
                <h2>Hello!</h2>
                <h3>Sign Up to Get Started.</h3>
                <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={emailid}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="phone"
                    name="phone"
                    placeholder="Phone #"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <Select className="profile-select"
                    defaultValue={profileType}
                    onChange={(e) => setProfileType(e.valueOf())}
                    options={profileOptions}
                    value={profileType} 
                    styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                        }),
                    }}
                />
                <button variant="primary" type="submit" className="button">Register</button>
                </form>
                <a href="./login">Already a user? Login</a>
            </div>
        </div>
    </div>
);
};

export default Register;