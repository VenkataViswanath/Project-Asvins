import Sidebar from './Sidebar';
import InsuranceProfile from './InsuranceProfile';
import "../css/Search.css";
import React, { useState, useEffect } from 'react';
import { UserAuth } from "../context/AuthContext";
import userIcon from "../images/userIcon.png";
import InsuranceProviders from './InsuranceProviders';

function DoctorSearch() {

    const [searchTerm, setSearchTerm] = React.useState("");
    const handleChange = event => { setSearchTerm(event.target.value); };

    const [providers, setProviders] = useState([]);
    const [filteredInsurance, setFilteredInsurance] = useState(null);

    useEffect(() => {
        const fetchInsurance = async () => {
          try {
            const response = await fetch('http://localhost:3000/api/v1/insuranceproviders', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
      
            // Transform the data into the desired format
            const formattedInsurance = data.data
              .filter(
                (provider) =>
                  provider.fullname !== null &&
                  provider.photo !== null &&
                  provider.emailid !== null
              )
              .map((provider) => ({
                name: provider.fullname,
                image: provider.photo === 'no-photo.jpg' ? userIcon : provider.photo,
                email: provider.emailid,
              }));
      
            // Update the state with the formatted doctors array
            setProviders(formattedInsurance);
      
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchInsurance(); // Call the fetchData function when the component mounts
    }, []);
    
    const handleSearch = (event) => {
      event.preventDefault();
  
      const newFilteredInsurance = providers.filter((provider) => {
        console.log("doc" + provider.specialties);
        
        const nameLower = provider.name ? provider.name.toLowerCase() : "";
        const locationLower = provider.location ? provider.location.toLowerCase() : "";
  
        return (
          nameLower.includes(searchTerm.toLowerCase()) ||
          locationLower.includes(searchTerm.toLowerCase())
        );
      });
  
      // Update the state with the filtered doctors
      setFilteredInsurance(newFilteredInsurance);
    };
    
    const { userInfo } = UserAuth();
    console.log(userInfo);
    const user = [{
        image: 'http://placekitten.com/g/200/300',
        name: userInfo.fullname,
        title: 'Patient',
    },];

    console.log(searchTerm);
    
    return (
        <div className="app">
            <div className="container">
                <Sidebar user={user} />
                <div className='container'>
                    <div className="content">
                        <h3>Search for Insurance Packages and Providers</h3>
                        <InsuranceProviders/>
                        <p>Search for a insurance provider that will fit your needs.</p>
                    
                    <form onSubmit={handleSearch}>
                    <div className="search">
                    <div className="searchbar">
                        <input
                        type="text"
                        placeholder="Search for Insurance Agents by Name, Location..."
                        value={searchTerm}
                        onChange={handleChange}
                        />
                    </div>
                    
                    <button variant="primary" type="submit" className="button-small">Search</button>
                    </div>
                    </form>

                    {filteredInsurance ? (filteredInsurance.map((doctor, index) => (
                        <InsuranceProfile key={index} {...doctor} />
                    ))) : (providers.map((provider, index) => (
                        <InsuranceProfile key={index} {...provider} />
                    )))}

                </div>
                </div>
            </div>
        </div>
    )
}
export default DoctorSearch;