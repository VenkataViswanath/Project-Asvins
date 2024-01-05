import Sidebar from './Sidebar';
import DoctorProfile from './DoctorProfile';
import "../css/Search.css";
import React, { useState, useEffect } from 'react';
import { UserAuth } from "../context/AuthContext";
import userIcon from "../images/userIcon.png";

function DoctorSearch() {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchRadius, setSearchRadius] = React.useState("");
    const handleRadius = event => { setSearchRadius(event.target.value); };
    const handleChange = event => { setSearchTerm(event.target.value); };
    const [userPosition, setUserPosition] = React.useState("");

    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState(null);
    const { userInfo } = UserAuth();
    const user = [{
        image: userInfo.photo === 'no-photo.jpg' ? userIcon : userInfo.photo,
        name: userInfo.fullname,
        title: 'Patient',
    },];

    const getUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
    
            try {
              const apiKey = 'AIzaSyBHIooGKgmnz0T05HVxp3XiqUgPhrTL55A'; // Replace with your actual API key
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
              );
    
              if (!response.ok) {
                throw new Error('Error fetching address from coordinates');
              }
    
              const data = await response.json();
    
              // Assuming the first result contains the zip code, modify as needed
              const zipCode = data.results[0]?.address_components.find(
                (component) => component.types.includes('postal_code')
              )?.short_name;
              setUserPosition(zipCode);
            } catch (error) {
              console.error('Error getting user\'s address:', error);
            }
          },
          (error) => {
            console.error('Error getting user\'s location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by your browser.');
      }
    };
    

    useEffect(() => {
        getUserLocation();
        const fetchDoctors = async () => {
          try {
            const response = await fetch('http://localhost:3000/api/v1/doctors', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
      
            // Transform the data into the desired format
            const formattedDoctors = data.data
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
      
            // Update the state with the formatted doctors array
            setDoctors(formattedDoctors);

            doctors.forEach((doctor) => console.log("doctor:", doctor._id));
      
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchDoctors(); // Call the fetchData function when the component mounts
    }, []);
    
    const handleSearch = async (event) => {
      event.preventDefault();

      if(userPosition){
        try {
          const response = await fetch(`http://localhost:3000/api/v1/doctors/radius/${userPosition}/${searchRadius ? searchRadius : 10}`);
          const data = await response.json();
          const formattedDoctors = data.data
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
          const newFilteredDoctors = formattedDoctors.filter((doctor) => {
        
            const nameLower = doctor.name ? doctor.name.toLowerCase() : "";
            const locationLower = doctor.location ? doctor.location.toLowerCase() : "";
            const specialtiesLower = doctor.specialties ? doctor.specialties.map(specialty => specialty.toLowerCase()) : [];
      
            return (
              nameLower.includes(searchTerm.toLowerCase()) ||
              locationLower.includes(searchTerm.toLowerCase()) ||
              specialtiesLower.includes(searchTerm.toLowerCase())
            );
          });
          setFilteredDoctors(newFilteredDoctors);
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      } else {
        const newFilteredDoctors = doctors.filter((doctor) => {
        
          const nameLower = doctor.name ? doctor.name.toLowerCase() : "";
          const locationLower = doctor.location ? doctor.location.toLowerCase() : "";
          const specialtiesLower = doctor.specialties ? doctor.specialties.map(specialty => specialty.toLowerCase()) : [];
    
          return (
            nameLower.includes(searchTerm.toLowerCase()) ||
            locationLower.includes(searchTerm.toLowerCase()) ||
            specialtiesLower.includes(searchTerm.toLowerCase())
          );
        });
        // Update the state with the filtered doctors
        setFilteredDoctors(newFilteredDoctors);
      }
    };
    
    return (
        <div className="app">
            <div className="container">
                <Sidebar user={user} />
                <div className="container">
                    <div className="content">
                        <h3>Search for Doctors</h3>
                        <p>Search for a doctor that will fit your needs.</p>
                    
                    <form onSubmit={handleSearch}>
                    <div className="search">
                    <div className="searchbar">
                        <input
                        type="text"
                        placeholder="Search for Doctors by Name, Location, Specialties..."
                        value={searchTerm}
                        onChange={handleChange}
                        />
                    </div>
                    
                    <div className="radius">
                      <label>
                        Radius within
                        <input
                          type="number"
                          placeholder="10"
                          value={searchRadius}
                          onChange={handleRadius}
                          min="0"
                        />
                        miles
                      </label>
                    </div>

                    <button variant="primary" type="submit" className="button-small">Search</button>
                    </div>
                    </form>

                    {filteredDoctors ? (filteredDoctors.map((doctor, index) => (
                        <DoctorProfile key={index} {...doctor} />
                    ))) : (doctors.map((doctor, index) => (
                        <DoctorProfile key={index} {...doctor} />
                    )))}

                </div>
                </div>
            </div>
        </div>
    )
}
export default DoctorSearch;