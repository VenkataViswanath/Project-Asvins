import React from 'react';
import "../css/Dashboard.css";
import "../css/Profile.css";
import Profile from './Profile-Preview';
import Calender from './Calendar';
import Appointment from './Appointment';
import Sidebar from './SidebarDoctor';
// import MultiSelectForm from './MultiSelectForm';
// import {Link} from 'react-router-dom';

const user = [{
    image: 'https://www.narayanahealth.org/sites/default/files/leadership/ldr-01-compressor.jpg',
    name: 'Dr. Devi Shetty',
    title: 'Orthopedic Surgeon',
},];

const patients = [{
    image: 'https://wpdaddy.com/wp-content/uploads/2020/11/thispersondoesnotexist.jpg',
    name: 'Joel Jacob',
    title: 'Ligament Tear',
},];

const patients1 = [{
    image: 'https://cdn.pixabay.com/photo/2020/04/11/10/36/man-5029835_1280.jpg',
    name: 'ArvindKumar',
    title: ' Muscle Spasm Recovery',
},];

// const bedAvail = [{
//     available: 'Available Beds : 54',
//     total: 'Total Beds : 80',
// },];

const appointments = [{
    time: '2:30 PM',
    date: 'September 20th, 2023', 
    patient: 'Arvind Kumar', 
    address: '600 N Eagleson Ave',
    photo: 'http://placekitten.com/g/200/300'
},];

// for health form
// const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];


function DashboardDoctor() {
    return (
        <div className="app">
        <div className="container">
            <Sidebar user={user} />
            <div className='container'>
            <div className="content">
                <h3>Welcome Dr. Shetty </h3>
                <p>Stay up to date with your appointments, patients and other information all in one place.</p>
                
                <div className="block">
                <h3>Your Patients</h3>
                <p className="div">See your current patients here.</p>
                    {patients.map((patients, index) => (
                        <Profile key={index} {...patients} />
                    ))}

                    <br></br>
                    {patients1.map((patients1, index) => (
                        <Profile key={index} {...patients1} />
                    ))}  
                <div style={{textAlign: 'right',}}>
                {/* <Link to="./patients"><button className="button-small">Find a Patient</button></Link> */}
                    
                            
                </div>
                </div>
                <div className="block">
                <h3>Available Beds <img src= "https://thumbs.dreamstime.com/z/hospital-bed-linear-icon-thin-line-illustration-vector-isolated-outline-drawing-93593969.jpg?w=768" alt='' width={70} height={40}></img></h3>
                <p className="div">Current bed availibility of the hospital can be checked here
                <br></br>
                <h5>Total Beds : 80</h5>
                <h5>Available Beds : 24</h5>
                <h5>Occupied Beds : 56</h5>
                </p>
                    {/* {bedAvail.map((bedAvail, index) => (
                        <Profile key={index} {...bedAvail} />
                    ))} */}
                    {/* <div style={{textAlign: 'right'}}>
                        <button className="button-small">
                            <div className="text-wrapper-2">Chat with Provider</div>
                        </button>
                    </div> */}
                </div>
                {/* <div className="block">
                    <h5>Your Health</h5>
                    <p>Edit your healthcare information</p>
                    
                    <MultiSelectForm options={options}/>
                    <MultiSelectForm options={options}/>


                </div> */}
            </div>
        </div>
        <div className='content'>
            <Calender/>
            {appointments.map((appointment, index) => (
                <Appointment key={index} {...appointment} />
            ))}
            
        </div>
        </div>
        </div>
    );
  }
  
export default DashboardDoctor;