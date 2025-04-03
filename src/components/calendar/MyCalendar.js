import Calendar from 'react-calendar';
import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './MyCalendar.css';

function MyCalendar() {
    const [value, onChange] = useState(new Date());
    return <Calendar onChange={onChange} value={value} />;
}

export default MyCalendar