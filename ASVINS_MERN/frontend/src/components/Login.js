import React, { useState } from "react";
import "../css/Register.css";
import Heart from "../images/heart_logo.svg";
import Select from 'react-select';
import { Alert } from 'react-bootstrap';
import OverlayMFA from "./OverlayMFA";
import { useNavigate } from 'react-router-dom';
import { PhoneAuthProvider, PhoneMultiFactorGenerator, getMultiFactorResolver } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { auth } from "./firebaseConfig";
import GoogleButton from "react-google-button";


const Login = () => {
    const [formData, setFormData] = useState({
        emailid: '',
        password: '',
    });

    const [verifying, setVerifying] = useState(false);
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState("");
    const [resolver, setResolver] = useState(null);
    const [emailid, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileType, setProfileType] = useState('');
    const { user, userInfo, changeUserInfo, logIn, setUpRecaptcha, googleLogIn } = UserAuth();
    const [err, setErr] = useState("");

    const profileOptions = [
        { value: 'patient', label: 'Patient' },
        { value: 'doctor', label: 'Doctor' },
        { value: 'insurance_provider', label: 'Insurance Provider' },
    ];

    const navigate = useNavigate();
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // submitting the form to mongo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailid !== '' && password !== '') {

            setFormData({ emailid: emailid, password: password });

            // setting the profile type based on the type selected

            let apiUrl = '/api/v1/patients/loginPatient'; // Default API endpoint
            // Check the value of formData.profileType and set the apiUrl accordingly
            if (profileType.value === 'doctor') {
                apiUrl = '/api/v1/doctors/loginDoctor';
            } else if (profileType.value === 'insurance_provider') {
                apiUrl = '/api/v1/insuranceproviders/loginInsuranceProvider';
            }
            console.log("emailid: " + emailid);
            console.log("password: " + password);
            console.log("profileType: " + profileType.value);
            console.log('http://localhost:3000' + apiUrl);

            const token = getToken();
            // POSTING FORM DATA ------------------------------
            const response = await fetch('http://localhost:3000' + apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    emailid: emailid,
                    password: password,
                })
            })
            const json = await response.json();
            if (!response.ok) {
                console.log("Request failed");
                console.log(json.error);
            }
            if (json.success && response.ok) {
                console.log("json " + json + " response" + response);
                localStorage.setItem('token', json.token);
                localStorage.setItem('userInfo', JSON.stringify(json.data));
                changeUserInfo(json.data);
                firebaseLogIn();
            } else {
                // Handle failed login
                setErr("Failed to Login: Your email or password is incorrect");
            }

        } else {
            if (emailid === '' && password === '') {
                setErr('Please enter an email address and password');
            } else if (emailid === '') {
                setErr('Please enter an email address');
            } else if (password === '') {
                setErr('Please enter a password');
            }
        }
    };

    const handleGoogleButtonClick = async (e) => {
        e.preventDefault();
        try {
            const cred = await googleLogIn();
            const googleUser = cred.user;
            console.log("Creation time: " + googleUser.metadata.creationTime);
            console.log("login time: " + googleUser.metadata.lastSignInTime);
            if (googleUser.metadata.creationTime === googleUser.metadata.lastSignInTime) {
                navigate("/registergoogleuser");
            } else {
                const response = await fetch('http://localhost:3000/api/v1/patients/loginPatient', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emailid: googleUser.email,
                        password: "#pa!ss#wo!rd$",
                    })
                })
                const json = await response.json();
                changeUserInfo(json.data);
                if (response.ok) {
                    localStorage.setItem('token', json.token);
                    localStorage.setItem('userInfo', JSON.stringify(json.data));
                    navigate("/patient-dashboard");
                } else {
                    alert("An error has occurred. Please try again");
                }
            }
        } catch (e) {
            setErr(e);
        }
    };

    const firebaseLogIn = async () => {
        setErr("");
        if (user !== null) {
            navigate("/patient-dashboard");
        } else {
            try {
                logIn(emailid, password)
                    .then(function (userCredential) {
                        navigate("/patient-dashboard");
                    })
                    .catch(async function (error) {
                        if (error.code === 'auth/multi-factor-auth-required') {
                            const newResolver = await getMultiFactorResolver(auth, error);
                            setResolver(newResolver);
                            const phoneOp = {
                                multiFactorHint: newResolver.hints[0],
                                session: newResolver.session
                            };
                            const phoneAuthProvider = new PhoneAuthProvider(auth);
                            const verifier = await setUpRecaptcha();
                            const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
                                phoneOp,
                                verifier
                            );
                            setVerificationId(newVerificationId);
                            setVerifying(true);
                        } else {
                            setErr(error.message);
                        }
                    })
            } catch (error) {
                setErr(error.message);
            }
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const cred = PhoneAuthProvider.credential(verificationId, otp);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
            await resolver.resolveSignIn(multiFactorAssertion);
            
            navigate("/patient-dashboard");
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="container">
            <div id="welcomeContainer">
                <div className="heart">
                    <img src={Heart} />
                </div>
                <div className="welcome">
                    <h1>Login to Asvins</h1>
                    <h3>Your favorite healthcare management system.</h3>
                    <a href="./learn" className="button">Learn More</a>
                </div>
            </div>
            <div id="helloContainer">
                <div className="hello">
                    <h2>Hello Again!</h2>
                    <h3>Login to get back to organizing your healthcare</h3>
                    {err && <Alert variant="danger" className="error-container">{err}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={emailid}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <button variant="primary" type="submit" className="button" style={{ marginBottom: '10px' }}>Login</button>
                        
                        <div id="recaptcha-container"></div>

                        { profileType.value === "patient" && (
                        <div>
                            <p>Notice: Only Patients can use Google Login.</p>
                            <GoogleButton
                                className="g-btn"
                                type="dark"
                                onClick={handleGoogleButtonClick}
                            />
                        </div>
                        )}
                        
                    </form>
                    <a href="./register"><p>Not a user? Register</p></a>
                </div>
            </div>
            {verifying && (
                <OverlayMFA>
                    <form onSubmit={verifyOtp}>
                        <input
                            type="text"
                            placeholder="Enter Verification Code"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button variant="primary" type="submit" className="button">Verify</button>
                    </form>
                </OverlayMFA>
            )}
        </div>
    );
};

export default Login;