/**
 * File: MyCalendar.js
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * A wrapper around the react-calendar library that handles calendar date selection.
 * Displays an interactive calendar UI and maintains the selected date using local state.
 */

import Calendar from 'react-calendar';
import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './MyCalendar.css';

/**
 * Calendar component using react-calendar.
 * 
 * @returns {JSX.Element} A calendar UI component with current date selected by default.
 */
function MyCalendar() {
    // State to hold the selected calendar date
    const [value, onChange] = useState(new Date());

    // Render the calendar and update state when a new date is selected
    return <Calendar onChange={onChange} value={value} />;
}

export default MyCalendar;
