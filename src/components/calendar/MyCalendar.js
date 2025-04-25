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

import React from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MyCalendar.css';

/**
 * Calendar component using react-calendar.
 * 
 * @returns {JSX.Element} A calendar UI component with current date selected by default.
 */
function MyCalendar({ selectedDate, onDateChange }) {
    return (
      <Calendar
        value={selectedDate}
        onChange={onDateChange}
      />
    );
}

MyCalendar.propTypes = {
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    onDateChange: PropTypes.func.isRequired
};

export default MyCalendar;
