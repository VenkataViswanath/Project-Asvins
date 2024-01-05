import "../css/Dashboard.css";
import Calender from './Calendar';
import Appointment from './Appointment';
import Sidebar from './Sidebar';


const user = [{
    image: 'http://placekitten.com/g/200/300',
    name: 'Margaret Nigh',
    title: 'Patient',
},];

const appointments = [{
    time: '2:30 PM',
    date: 'September 20th, 2023', 
    doctor: 'Dr. John Doe', 
    address: '600 N Eagleson Ave',
    photo: 'http://placekitten.com/g/200/300'
},];

function DashboardAppointments() {
    return (
        <div className="app">
        <div className="container">
            <Sidebar user={user} />
            <div className='container'>
            <div className="content">
                <h3>Welcome ...</h3>
                <p>Stay up to date with your appointments, doctor, and insurance information all in one place.</p>
                <div className="full-calender">
                    <Calender/>
                </div>
                {appointments.map((appointment, index) => (
                    <Appointment key={index} {...appointment} />
                ))}
            </div>
        </div>
        </div>
    </div>
)} 

export default DashboardAppointments;