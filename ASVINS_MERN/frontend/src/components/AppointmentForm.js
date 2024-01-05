import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ userInfo, doctorsWorked }) => {
    
    const getToken = () => {
        return localStorage.getItem('token');
    };

    const [apptData, setApptData] = useState({
        selectedDoctor: '', // Added for selected doctor
        appointmentDate: '', // Added for appointment date
        appointmentTime: '', // Added for appointment time
    });

    const [successMessage, setSuccessMessage] = useState('');

    console.log("appointments with", doctorsWorked);

    const handleNewAppointment = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            const appointmentsArray = userInfo.appointments ? userInfo.appointments : [];

            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }).format(new Date(apptData.appointmentDate));
    
            // Format the appointment time
            const formattedTime = apptData.appointmentTime;

            console.log("Formatted Time: ", formattedTime);

            appointmentsArray.push(formattedDate + ". " + `${formattedTime.slice(0,1)}` + ` ${parseInt(formattedTime.slice(0,1)) > 12 ? "AM" : "PM"}` + " EST");

            const response = await fetch(`http://localhost:3000/api/v1/patients/${userInfo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    appointments: appointmentsArray,
                }),
            });


            
            if (response.ok) {
                const updatedUserData = await response.json();
                console.log("This is updated", updatedUserData.data);
                setSuccessMessage('Appointment added successfully!');

                userInfo.appointments = updatedUserData.data.appointments;
                console.log("New Appointments: ", userInfo.appointments);
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

    const doctorOptions = Array.isArray(doctorsWorked)
    ? doctorsWorked.map((doctor) => (
        <option key={doctor._id} value={doctor._id}>
          {doctor.fullname}
        </option>
      ))
    : null;

    return (
        <div>
            <form onSubmit={handleNewAppointment}>
                <div>
                    <label>Select Doctor:</label>
                    <select
                        value={apptData.selectedDoctor}
                        onChange={(e) => setApptData({ ...apptData, selectedDoctor: e.target.value })}
                    >
                        <option value="" disabled>Select a doctor</option>
                        {doctorOptions}
                    </select>
                </div>
                <div>
                    <label>Appointment Date:</label>
                    <input
                        type="date"
                        value={apptData.appointmentDate}
                        onChange={(e) => setApptData({ ...apptData, appointmentDate: e.target.value })}
                    />
                </div>
                <div>
                    <label>Appointment Time:</label>
                    <input
                        type="time" // Use time input type for time picker
                        value={apptData.appointmentTime}
                        onChange={(e) => setApptData({ ...apptData, appointmentTime: e.target.value })}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {successMessage && <div>{successMessage}</div>}
        </div>
    );
};

export default AppointmentForm;
