import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components
import Register from './components/Register.js';
import Login from './components/Login.js';
import EnrollMFA from './components/EnrollMFA';
import './css/App.css';
import Dashboard from './components/DashboardPatient.js';
import { AuthContextProvider } from './context/AuthContext.js';
import DoctorSearch from './components/DoctorSearch.js';
import InsuranceSearch from './components/InsuranceSearch.js';
import DashboardDoctor from './components/DashboardDoctor.js';
import DashboardAppointments from './components/DashboardAppointments.js';
import RegisterGoogleUser from './components/RegisterGoogleUser.js';
import InsuranceProviderPolicies from './components/InsuranceProviderPolicies.js';
import DashboardInsuranceProvider from './components/DashboardInsuranceProvider.js';

function App() {
  return (

    <Router>
      <main className="home">
        <div>
          <AuthContextProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/patient-dashboard" element={<Dashboard />} />
              <Route path="/enroll" element={<EnrollMFA />} />
              <Route path="/patient-dashboard/doctors" element={<DoctorSearch />} />
              <Route path="/patient-dashboard/insurance-providers" element={<InsuranceSearch />} />
              <Route path="/patient-dashboard/appointments" element={<DashboardAppointments />} />

              <Route path="/doctor-dashboard" element={<DashboardDoctor />} />
              <Route path="/doctor-dashboard/appointments" element={<DashboardAppointments />} />
              <Route path="/registergoogleuser" element={<RegisterGoogleUser />} />

              <Route path="/InsuranceProviderDashboard" element={<DashboardInsuranceProvider />} />
              <Route path="/InsuranceProviderDashboard/policies" element={<InsuranceProviderPolicies />} />

            </Routes>
          </AuthContextProvider>
        </div>
      </main>
    </Router>

  );
}

export default App;
