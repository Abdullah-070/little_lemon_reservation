import React from 'react';
import BookingForm from './BookingForm';

/**
 * Main Component
 * Contains the primary content area with booking form
 */
function Main({ availableTimes, updateTimes, submitForm }) {
  return (
    <main className="main" role="main">
      <section className="hero" aria-labelledby="hero-title">
        <h2 id="hero-title">Reserve Your Table</h2>
        <p>Experience authentic Mediterranean cuisine in the heart of Chicago</p>
      </section>

      <section className="booking-section" aria-labelledby="booking-title">
        <BookingForm
          availableTimes={availableTimes}
          updateTimes={updateTimes}
          submitForm={submitForm}
        />
      </section>
    </main>
  );
}

export default Main;