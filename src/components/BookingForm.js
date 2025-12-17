import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BookingForm Component
 * Handles table booking with comprehensive validation
 * @param {Object} props - Component props
 * @param {Array} props.availableTimes - Available booking times
 * @param {Function} props.updateTimes - Function to update available times
 * @param {Function} props.submitForm - Function to submit booking
 */
function BookingForm({ availableTimes, updateTimes, submitForm }) {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    occasion: 'Birthday',
    firstName: '',
    email: ''
  });

  // Error state for validation
  const [errors, setErrors] = useState({});
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Gets minimum date (today) for date input
   * @returns {string} Date in YYYY-MM-DD format
   */
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * Gets maximum date (3 months from now) for date input
   * @returns {string} Date in YYYY-MM-DD format
   */
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  /**
   * Handles date input click to ensure calendar picker opens
   * @param {Event} e - Click event
   */
  const handleDateClick = (e) => {
    e.target.showPicker?.();
  };

  /**
   * Validates form field
   * @param {string} name - Field name
   * @param {*} value - Field value
   * @returns {string} Error message or empty string
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'date':
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Date cannot be in the past';
        return '';

      case 'time':
        if (!value) return 'Time is required';
        return '';

      case 'guests':
        if (!value) return 'Number of guests is required';
        if (value < 1) return 'Minimum 1 guest required';
        if (value > 10) return 'Maximum 10 guests allowed';
        return '';

      case 'firstName':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';

      default:
        return '';
    }
  };

  /**
   * Handles input change with validation
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Special handling for date change
    if (name === 'date' && value) {
      updateTimes(new Date(value));
      // Reset time selection when date changes
      setFormData(prev => ({ ...prev, time: '' }));
    }

    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  /**
   * Validates entire form
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Submit form data
    const success = submitForm(formData);

    setIsSubmitting(false);

    if (success) {
      // Navigate to confirmation page
      navigate('/confirmed', { state: { booking: formData } });
    } else {
      // Show error message
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit booking. Please try again.'
      }));
    }
  };

  return (
    <form 
      className="booking-form" 
      onSubmit={handleSubmit}
      aria-labelledby="booking-form-title"
      noValidate
    >
      <h2 id="booking-form-title">Reserve a Table</h2>

      {/* Date Field */}
      <div className="form-group">
        <label htmlFor="res-date">
          Choose date <span aria-label="required">*</span>
        </label>
        <input
          type="date"
          id="res-date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          onClick={handleDateClick}
          min={getMinDate()}
          max={getMaxDate()}
          required
          aria-required="true"
          aria-invalid={errors.date ? 'true' : 'false'}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && (
          <span id="date-error" className="error" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      {/* Time Field */}
      <div className="form-group">
        <label htmlFor="res-time">
          Choose time <span aria-label="required">*</span>
        </label>
        <select
          id="res-time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={errors.time ? 'true' : 'false'}
          aria-describedby={errors.time ? 'time-error' : undefined}
          disabled={!formData.date || availableTimes.length === 0}
        >
          <option value="">Select a time</option>
          {availableTimes.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.time && (
          <span id="time-error" className="error" role="alert">
            {errors.time}
          </span>
        )}
        {formData.date && availableTimes.length === 0 && (
          <span className="info" role="status">
            No available times for this date
          </span>
        )}
      </div>

      {/* Number of Guests */}
      <div className="form-group">
        <label htmlFor="guests">
          Number of guests <span aria-label="required">*</span>
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          min="1"
          max="10"
          required
          aria-required="true"
          aria-invalid={errors.guests ? 'true' : 'false'}
          aria-describedby={errors.guests ? 'guests-error' : 'guests-help'}
        />
        <small id="guests-help" className="help-text">
          Minimum 1, maximum 10 guests
        </small>
        {errors.guests && (
          <span id="guests-error" className="error" role="alert">
            {errors.guests}
          </span>
        )}
      </div>

      {/* Occasion */}
      <div className="form-group">
        <label htmlFor="occasion">Occasion</label>
        <select
          id="occasion"
          name="occasion"
          value={formData.occasion}
          onChange={handleChange}
        >
          <option value="Birthday">Birthday</option>
          <option value="Anniversary">Anniversary</option>
          <option value="Engagement">Engagement</option>
          <option value="Business">Business</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* First Name */}
      <div className="form-group">
        <label htmlFor="firstName">
          Your name <span aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={errors.firstName ? 'true' : 'false'}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <span id="firstName-error" className="error" role="alert">
            {errors.firstName}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">
          Email <span aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <span id="email-error" className="error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="error submit-error" role="alert">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
        aria-label="Submit reservation"
      >
        {isSubmitting ? 'Submitting...' : 'Make Your Reservation'}
      </button>
    </form>
  );
}

export default BookingForm;