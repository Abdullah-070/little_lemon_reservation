import React from 'react';
import { useLocation, Link } from 'react-router-dom';

/**
 * ConfirmedBooking Component
 * Displays booking confirmation with details
 */
function ConfirmedBooking() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <main className="main confirmation" role="main">
        <div className="confirmation-card">
          <h2>No Booking Found</h2>
          <Link to="/" className="button">Make a Reservation</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main confirmation" role="main">
      <div className="confirmation-card" role="alert" aria-live="polite">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h2>Booking Confirmed!</h2>
        
        <div className="booking-details">
          <h3>Your Reservation Details</h3>
          <dl>
            <dt>Name:</dt>
            <dd>{booking.firstName}</dd>

            <dt>Email:</dt>
            <dd>{booking.email}</dd>

            <dt>Date:</dt>
            <dd>{new Date(booking.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</dd>

            <dt>Time:</dt>
            <dd>{booking.time}</dd>

            <dt>Guests:</dt>
            <dd>{booking.guests}</dd>

            <dt>Occasion:</dt>
            <dd>{booking.occasion}</dd>
          </dl>
        </div>

        <p className="confirmation-message">
          A confirmation email has been sent to {booking.email}
        </p>

        <Link to="/" className="button">Make Another Reservation</Link>
      </div>
    </main>
  );
}

export default ConfirmedBooking;