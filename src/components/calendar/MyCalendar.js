import Calendar from 'react-calendar';
import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './MyCalendar.css';


// Calendar component using react-calendar lib
function MyCalendar() {
    const [value, onChange] = useState(new Date()); // sets the selected date, default is today
    return <Calendar onChange={onChange} value={value} />; // shows the calendar and updates when a date is picked
}

export default MyCalendar