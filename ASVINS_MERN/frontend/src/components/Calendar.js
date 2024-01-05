import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Calender() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleTodayClick = () => {
    setDate(new Date()); // Set the date to today's date
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="calendar"
      />
      <div style={{display: 'flex'}}>
        <div><p style={{ color: '#777', fontSize: '18px', paddingRight: '10px'}}>Appointments on</p></div>
        <div><p style={{ color: '#056DDC', fontSize: '18px', fontWeight: 'bold'}}>{date.toDateString()}</p></div>
        
        
      </div>
    </div>
  );
}

export default Calender;
