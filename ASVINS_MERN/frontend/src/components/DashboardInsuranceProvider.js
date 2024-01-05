import React, { useState } from 'react';
import '../css/Dashboard.css';
import '../css/Profile.css';
import Profile from './Profile-Preview';
import Calender from './Calendar';
import Appointment from './Appointment';
import InsuranceProviderSidebar from './InsuranceProviderSidebar';
import MultiSelectForm from './MultiSelectForm';
import { Link } from 'react-router-dom';
import InsuranceProviderPolicies from './InsuranceProviderPolicies';

const DashboardInsuranceProvider = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [updatedPolicy, setUpdatedPolicy] = useState('');

    const handleOpenPolicyModal = (patient) => {
      setSelectedPatient(patient);
      // Add logic to update insurance policy when the modal is opened
      const updatedPolicyResult = updateInsurancePolicy(patient.id);
      setUpdatedPolicy(updatedPolicyResult);
    };

    const handleClosePolicyModal = () => {
      setSelectedPatient(null);
      setUpdatedPolicy('');
    };

    const handleUpdatePolicy = () => {
      // Implement your logic to update the policy here
      console.log(`Updating policy for patient: ${selectedPatient.name}`);
      handleClosePolicyModal(); // Close the modal after updating the policy
    };

    const user = [{
        image: 'http://placekitten.com/g/200/300',
        name: 'Sumanth',
        title: 'Insurance Provider',
    },];
    
    const patients = [{
        id: 1,
        image: 'http://placekitten.com/g/200/300',
        name: 'John Doe',
        title: 'Covid-19 Pediatrics',
        pastRecord: 'flu',
        policy: 'None'
        },
        {
            id: 2,
            image: 'http://placekitten.com/g/200/300',
            name: 'Jane Smith',
            title: 'Cardiologist',
            pastRecord: 'heart attack',
            policy: 'None'
        },
    ];
    
    // Function to update insurance policy based on past health record
    function updateInsurancePolicy(patientId) {
      const patient = patients.find(p => p.id === patientId);
    
      if (!patient) {
        console.log('Patient not found');
        return;
      }
    
      console.log(`Updating insurance policy for ${patient.name} based on past health record: ${patient.pastRecord}`);
    
      switch (patient.pastRecord.toLowerCase()) {
        case 'flu':
          console.log('Recommendation: Consider bronze or silver policy');
          patient.policy = "bronze or silver policy"
          return 'Recommendation: Consider bronze or silver policy';
        case 'heart attack':
          console.log('Recommendation: Consider gold or platinum policy');
          patient.policy = "gold or platinum policy"
          return 'Recommendation: Consider gold or platinum policy';
        default:
          console.log('No specific recommendation for this past health record');
          return 'No specific recommendation for this past health record';
      }
    }
    
    const insurance = [{
        image: 'http://placekitten.com/g/200/300',
        name: 'John Doe',
        title: 'Aetna Insurance Agent',
    },];
    
    const appointments = [{
        time: '2:30 PM',
        date: 'September 20th, 2023', 
        doctor: 'Dr. John Doe', 
        address: '600 N Eagleson Ave',
        photo: 'http://placekitten.com/g/200/300'
    },];

    console.log("LOADING");

    return (
      <div className="container">
        <InsuranceProviderSidebar user={user} />
        <div className="container">
          <div className="content">
            <h2>Welcome {user[0].name}</h2>
            <p>Stay up to date with your appointments, patients, and insurance information all in one place.</p>
            <div className="block">
              <h4>Your Patients</h4>
              <p className="div">See your current patients and their insurance plans according to their health records.</p>
              {patients.map((patient, index) => (
                <div key={index} className="patient-entry">
                  <Profile style={{ marginTop: '20px' }}  {...patient} />
                  <div className="update-policy-button">
                    <button onClick={() => handleOpenPolicyModal(patient)}>Update Policy</button>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'right' }}>
                <Link to="./patients">
                  <button style={{ marginTop: '20px' }} className="button-small">Find a patient</button>
                </Link>
              </div>
            </div>
            {/* <div className="block">
              <h4>Your Health</h4>
              <p>Edit your healthcare information</p>
              <MultiSelectForm options={options} />
              <MultiSelectForm options={options} />
            </div> */}
          </div>
        </div>
        <div className="content">
          <Calender />
          {appointments.map((appointment, index) => (
            <Appointment key={index} {...appointment} />
          ))}
        </div>

      {/* Modal for updating policy */}
      {selectedPatient && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClosePolicyModal}>
              &times;
            </span>
            <h3>Update Policy for {selectedPatient.name}</h3>
            {/* Display the updated policy on the webpage */}
            <p>{updatedPolicy}</p>
            {/* Add your form or UI elements for updating the policy */}
            <button onClick={handleUpdatePolicy}>Update Policy</button>
          </div>
          </div>
      )}
      </div>
  );
}

export default DashboardInsuranceProvider;