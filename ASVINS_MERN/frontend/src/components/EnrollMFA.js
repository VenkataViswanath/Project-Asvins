import React, { useState } from "react";
import { auth } from "./firebaseConfig.js";
import { useNavigate } from "react-router";
import { PhoneAuthProvider, PhoneMultiFactorGenerator, multiFactor } from "firebase/auth";
import { UserAuth } from "../context/AuthContext.js";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

const EnrollMFA = () => {
    const [err, setErr] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verficationId, setVerficationId] = useState("");
    const navigate = useNavigate();
    const { user, setUpRecaptcha } = UserAuth();

    const enroll = async (e) => {
        e.preventDefault();
        setErr("");
        if (phone === "" || phone === undefined) {
            return setErr("Please enter a valid number");
        }
        try {
        console.log("Phone: ", phone);
        const MFASession = await multiFactor(user).getSession();
        const phoneOp = {
            phoneNumber: phone,
            session: MFASession,
        };
        const authProvider = new PhoneAuthProvider(auth);
        const recaptchaVerifier = await setUpRecaptcha();
        const userVerficationId = await authProvider.verifyPhoneNumber(
            phoneOp,
            recaptchaVerifier,
        );
        setVerficationId(userVerficationId);
        console.log("Verification ID: ", userVerficationId);
        alert("OTP sent to phone!")
        setIsVerifying(true);
        } catch(error) {
            setErr(error);
            console.error(err);
        }
    }

    const verify = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const credential = PhoneAuthProvider.credential(verficationId, otp);
            const multiFactorAssert = PhoneMultiFactorGenerator.assertion(credential);
            await multiFactor(user).enroll(multiFactorAssert, phone);
            navigate("/patient-dashboard");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="auth-container">
            <h3>Multifactor Authentication</h3>
            {err && <div className="error-container">{err}</div>}
            <form onSubmit={enroll} style={{ display: !isVerifying ? "block" : "none" }}>
                <PhoneInput
                    defaultCountry="US"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={setPhone}
                />
                <div id="recaptcha-container"></div>
                <button variant="primary" type="submit" className="button">Send code</button>
            </form>

            <form onSubmit={verify} style={{ display: isVerifying ? "block" : "none" }}>
                <input
                    type="text"
                    name="otp"
                    placeholder="Enter verification number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button variant="primary" type="submit" className="button">Verify</button>
            </form>
        </div>
    )
};

export default EnrollMFA;