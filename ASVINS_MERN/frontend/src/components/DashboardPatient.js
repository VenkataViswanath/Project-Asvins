import React, { useState, useEffect } from 'react';
import "../css/Dashboard.css";
import "../css/Profile.css";
import Profile from './Profile-Preview';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Appointment from './Appointment';
import Sidebar from './Sidebar';
import MultiSelectForm from './MultiSelectForm';
import { Link } from 'react-router-dom';
import { UserAuth } from "../context/AuthContext";
import OverlayMFA from "./OverlayMFA";
import userIcon from "../images/userIcon.png";
import DoctorProfile from './DoctorProfile';
import Select from 'react-select';
import AppointmentForm from './AppointmentForm';

function Dashboard() {
    const { userInfo, changeUserInfo } = UserAuth();
    console.log("user: " + userInfo.fullname);
    console.log("user: " + userInfo.emailid);
    console.log("user: " + userInfo._id);
    console.log("Doctors worked: " + userInfo.doctorsworked);

    console.log(userInfo);
    const user = [{
        image: userInfo.photo === 'no-photo.jpg' ? userIcon : userInfo.photo,
        name: userInfo.fullname,
        title: "Patient",
    },];

    const [doctors, setDoctors] = useState([]);
    const [insuranceProviders, setInsuranceProviders] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const getDoctors = async () => {
        try {
            const newDoctors = [];
            // Use Promise.all to wait for all asynchronous operations to complete
            await Promise.all(userInfo.doctorsworked.map(async (doctorID) => {
                const response = await fetch('http://localhost:3000/api/v1/doctors/' + doctorID, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log("HERE AGAIN", doctorID);

                if (!response.ok) {
                    console.log('Network response was not ok');
                } else {
                    const data = await response.json();
                    console.log("DATA: ", data);
                    newDoctors.push(data.data);
                }
            }));

            setDoctors(newDoctors);

        } catch (e) {
            console.error(e);
        }
    };

    const formattedDoctors = doctors
        .filter(
            (doctor) =>
                doctor.fullname !== null &&
                doctor.photo !== null &&
                doctor.condition_support !== null &&
                doctor.address !== null
            //doctor.averageRating !== undefined
        )
        .map((doctor) => ({
            name: doctor.fullname,
            image: doctor.photo === 'no-photo.jpg' ? userIcon : doctor.photo,
            specialties: doctor.condition_support,
            location: doctor.address,
            rating: doctor.averageRating ? doctor.averageRating.toFixed(1) : "No Rating",
        }));

    const formatDateTime = (dateTimeString) => {
        const [datePart, timePart] = dateTimeString.split('.');
        console.log('Date Part:', datePart.trim()); // Output: "Dec 5, 2023"
        console.log('Time Part:', timePart.trim()); // Output: "12 PM EST"
        return { datePart, timePart };
    };

    const getMonthIndex = (month) => {
        const monthAbbreviationsToFull = {
            'Jan': 'January',
            'Feb': 'February',
            'Mar': 'March',
            'Apr': 'April',
            'May': 'May',
            'Jun': 'June',
            'Jul': 'July',
            'Aug': 'August',
            'Sep': 'September',
            'Oct': 'October',
            'Nov': 'November',
            'Dec': 'December',
        };

        if (monthAbbreviationsToFull[month] !== undefined) {
            return monthAbbreviationsToFull[month]
        }
        return;
    }



    const [dateCal, setDateCal] = useState(new Date());

    var formattedAppointments =  [];
    if (doctors.length > 0) {
        formattedAppointments = appointments
            .map((appt) => {
                // Check if doctors array is not empty before accessing its elements
                if (doctors.length > 0) {
                    const { timePart, datePart } = formatDateTime(appt);
                    var hour = String(timePart).slice(1, 3);
                    if (hour.trim().length === 1) {
                        hour = "0" + hour.trim();
                    }
                    console.log("DateCal: ", dateCal);
                    const formattedTime = `${hour}:00:00`
                    const datePieces = datePart.split(' ');
                    const abbrevMonth = datePieces[0];
                    const month = getMonthIndex(abbrevMonth.trim());
                    var day = datePieces[1].slice(0, 1);
                    if (day.trim().length === 1) {
                        day = "0" + day.trim();
                    }
                    const year = datePieces[1].slice(3, datePieces[1].length);
                    const formattedDate = month + " " + day + ", " + year + " " + formattedTime;
                    console.log("Date: ", formattedDate);
                    const dateObject = new Date(formattedDate);
                    console.log("new appt date", dateObject);

                    // Check if datePart is valid
                    if (dateObject && (dateObject.getDay() === dateCal.getDay()) && (dateObject.getMonth() === dateCal.getMonth()) && (dateObject.getFullYear === dateCal.getFullYear)) {
                        return {
                            doctor: doctors[0].fullname,
                            photo: doctors[0].photo === 'no-photo.jpg' ? userIcon : doctors[0].photo,
                            address: doctors[0].address,
                            time: timePart,
                            date: datePart,
                        };

                    } else {
                        console.error('DatePart null or not today');
                        return null; // or provide default values as needed
                    }
                } else {
                    // Handle the case when doctors array is empty
                    console.error('Doctors array is empty');
                    return null; // or provide default values as needed
                }
            });
    }

    console.log("formatted appointments: ", formattedAppointments);

    useEffect(() => {

        getDoctors();
        if (userInfo.appointments) {
            setAppointments(userInfo.appointments);
        }
    }, [userInfo]);


    const [formData, setFormData] = useState({
        dob: '',
        address: '',
        symptoms: '',
        sex: '',
        conditions: [],
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const handleNewInfo = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3000/api/v1/patients/${userInfo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    dob: formData.dob,
                    address: formData.address,
                    symptoms: formData.symptoms,
                    sex: formData.sex,
                    conditions: formData.conditions,
                }),
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                console.log(updatedUserData);
                setSuccessMessage('Data updated successfully!');

                // Update userInfo only if there's a change
                if (formData.dob) userInfo.dob = formData.dob;
                if (formData.address) userInfo.address = formData.address;
                if (formData.symptoms) userInfo.symptoms = formData.symptoms;
                if (formData.sex) userInfo.sex = formData.sex;
                if (formData.conditions) userInfo.conditions = formData.conditions;

                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            } else {
                console.error('Failed to update user data');
                setSuccessMessage('Error updating data. Please try again.');
            }

        } catch (error) {
            setSuccessMessage('An unexpected error occurred. Please try again.');
            console.error('Error updating user data:', error);
        }
    };

    // TestResults component
    const TestResults = ({ testDate, testType, viralLoad, additionalResults }) => (
        <div>
            <h5>Test Results</h5>
            <p>Date of Test: {testDate}</p>
            <p>Test Type: {testType}</p>
            <p>Viral Load: {viralLoad}</p>
            {additionalResults && (
                <div>
                    <h5>Additional Results</h5>
                    <p>{additionalResults}</p>
                </div>
            )}
        </div>
    );

    const conditions = [
        'Allergies',
        'Asthma',
        'Cancer',
        'Cardiovascular Disease',
        'Diabetes',
        'Digestive Disorders',
        'Epilepsy',
        'Hypertension',
        'Mental Health Conditions',
        'Neurological Disorders',
        'Orthopedic Issues',
        'Respiratory Conditions',
        'Skin Conditions',
        'Thyroid Disorders',
        'Vision or Hearing Impairments',
    ];

    const testResults = {
        testDate: '2023-01-15',
        testType: 'COVID-19 RT-PCR Test',
        viralLoad: 'Moderate',
        additionalResults: 'Normal blood count, no abnormal liver function',
    };

    const dobDate = userInfo.dob ? new Date(userInfo.dob) : null;

    // Format the date of birth
    const formattedDOB = dobDate
        ? dobDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : "Not given";

    const calculateAge = (dob) => {
        const dobDate = new Date(dob);
        const currentDate = new Date();

        let age = currentDate.getFullYear() - dobDate.getFullYear();

        // Adjust age if birthday hasn't occurred yet this year
        if (
            currentDate.getMonth() < dobDate.getMonth() ||
            (currentDate.getMonth() === dobDate.getMonth() &&
                currentDate.getDate() < dobDate.getDate())
        ) {
            age--;
        }
        return age;
    }

    const [selectedConditions, setSelectedConditions] = useState([]);

    const handleOptionChange = (selectedOptions) => {
        // Handle selection changes for the conditions
        setSelectedConditions(selectedOptions);

        // Update the formData with the selected conditions
        setFormData({
            ...formData,
            conditions: selectedOptions.map(option => option.value),
        });
    };

    const transformedConditions = conditions.map(condition => ({
        value: condition,
        label: condition,
    }));
    const [successMessage, setSuccessMessage] = useState('');
    const handleDateChange = (selectedDate) => {
        setDateCal(selectedDate);
    };


    return (
        <div className="app">
            <div className="container">
                <Sidebar user={user} />
                {userInfo === undefined && (
                    <OverlayMFA>
                        <div>
                            <p>Please Sign in to see your Dashboard</p>
                            <Link to="/login"><button className="button-small">Login</button></Link>
                        </div>
                    </OverlayMFA>

                )}
                <div className='container'>

                    <div className="content">
                        <h3>Welcome {userInfo.fullname}</h3>
                        <p>Stay up to date with your appointments, doctor, and insurance information all in one place.</p>

                        <div className="block">
                            <h4>Your Doctors</h4>
                            <p className="div">See your current doctors or find a specialized doctor for your needs.</p>
                            {formattedDoctors.length > 0 ? (
                                formattedDoctors.map((doctor, index) => (
                                    <DoctorProfile key={index} {...doctor} />
                                ))
                            ) : (
                                <p style={{ color: '#0582ff' }}>You do not have any doctors yet.</p>
                            )}

                            <div style={{ textAlign: 'right', }}>
                                <Link to="./doctors"><button className="button-small">Find a Doctor</button></Link>


                            </div>
                        </div>
                        <div className="block">
                            <h4>Your Insurance</h4>
                            <p className="div">See your current insurance and chat with a provider.</p>
                            <h4>Insurance Package: </h4>
                            {userInfo.insurancePackage && (
                                <div>
                                    <p><b>Insurance Provider: </b>{userInfo.insurancePackage.insuranceProvider}</p>
                                    <p><b>Policy Number: </b>{userInfo.insurancePackage.policyNumber}</p>
                                    <p><b>Coverage Type: </b>{userInfo.insurancePackage.coverageType}</p>
                                    <p><b>Start Date: </b>{userInfo.insurancePackage.startDate}<b> End Date: </b>{userInfo.insurancePackage.endDate}</p>
                                    <p><b>Deductible: </b>${userInfo.insurancePackage.deductible}<b>  ~  Copay: </b> ${userInfo.insurancePackage.copay}<b>  ~  Coverage Amount</b>  ${userInfo.insurancePackage.coverageAmount}</p>
                                </div>
                            )}
                            {insuranceProviders.map((insurance, index) => (
                                <Profile key={index} {...insurance} />
                            ))}

                            <div style={{ textAlign: 'right' }}>
                                <button className="button-small">
                                    <div className="text-wrapper-2">Chat with Provider</div>
                                </button>
                            </div>
                        </div>
                        <div className="block">
                            <h4>Your Information and Health Details</h4>
                            <p><b>Full Name: </b>{userInfo.fullname}</p>
                            <p><b>Email: </b>{userInfo.emailid}</p>
                            <p><b>Phone Number: </b>{userInfo.phone}</p>
                            <p><b>Address: </b>{userInfo.address ? userInfo.address : "NA"}</p>
                            <p><b>Date of Birth: </b>{formattedDOB}</p>
                            <p><b>Age: </b>{userInfo.dob ? calculateAge(userInfo.dob) : "NA"}</p>
                            <p><b>Sex: </b>{userInfo.sex ? userInfo.sex : "NA"}</p>
                            <div className="data">
                                <h5>Symptom Details</h5>
                                <p>{userInfo.symptoms ? userInfo.symptoms : "NA"}</p>
                                <TestResults {...testResults} />
                                <h5>Medical History</h5>
                                <p>Pre-existing Conditions:</p>
                                {userInfo.conditions && userInfo.conditions.length > 0 ? (
                                    <ul>
                                        {userInfo.conditions.map((condition, index) => (
                                            <li key={index}>{condition}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>NA</p>
                                )}
                            </div>

                            <h5>Edit your Information</h5>

                            <form onSubmit={handleNewInfo}>
                                <label>Date of Birth:</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                />
                                <br />
                                <label>Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                <br />
                                <label>Symptoms:</label>
                                <input
                                    type="text"
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleInputChange}
                                />
                                <label>Sex:</label>
                                <input
                                    type="text"
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleInputChange}
                                />
                                <label>Conditions:</label>
                                <Select
                                    isMulti
                                    options={transformedConditions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={selectedConditions}
                                    onChange={handleOptionChange}
                                />
                                <button className="button-small" style={{ marginTop: '10px' }} type="submit">Save</button>
                            </form>
                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                        </div>
                    </div>
                </div>
                <div className='content'>

                    <div className="calendar-container">
                        <Calendar
                            onChange={handleDateChange}
                            value={dateCal}
                            className="calendar"
                        />
                        <div style={{ display: 'flex' }}>
                            <div><p style={{ color: '#777', fontSize: '18px', paddingRight: '10px' }}>Appointments on</p></div>
                            <div><p style={{ color: '#056DDC', fontSize: '18px', fontWeight: 'bold' }}>{dateCal.toDateString()}</p></div>


                        </div>
                    </div>
                    <div className='apptForm'>
                        {formattedAppointments[0] && (formattedAppointments.map((appointment, index) => (
                            <Appointment key={index} {...appointment} />
                        )))}
                        <h5>Create a New Appointment</h5>
                        <AppointmentForm userInfo={userInfo} doctorsWorked={doctors} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;