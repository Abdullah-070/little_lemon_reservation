import React, { useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Main from './components/Main';
import Footer from './components/Footer';
import ConfirmedBooking from './components/ConfirmedBooking';
import { fetchAPI, submitAPI } from './utils/api';
import './App.css';

/**
 * Reducer function to manage available booking times
 * @param {Array} state - Current available times
 * @param {Object} action - Action object with type and payload
 * @returns {Array} Updated available times
 */
export const timesReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TIMES':
      // Fetch available times based on selected date
      return fetchAPI(action.payload);
    case 'INIT_TIMES':
      // Initialize times for today
      return fetchAPI(new Date());
    default:
      return state;
  }
};

/**
 * Main App Component
 * Manages booking state and provides routing
 */
function App() {
  // Initialize available times using reducer
  const [availableTimes, dispatch] = useReducer(
    timesReducer,
    [],
    () => fetchAPI(new Date())
  );

  /**
   * Updates available times when date changes
   * @param {Date} date - Selected date
   */
  const updateTimes = (date) => {
    dispatch({ type: 'UPDATE_TIMES', payload: date });
  };

  /**
   * Submits booking data to API
   * @param {Object} formData - Booking form data
   * @returns {boolean} Success status
   */
  const submitForm = (formData) => {
    const success = submitAPI(formData);
    return success;
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <Main
                availableTimes={availableTimes}
                updateTimes={updateTimes}
                submitForm={submitForm}
              />
            }
          />
          <Route path="/confirmed" element={<ConfirmedBooking />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;