/**
 * API utility functions
 * Simulates backend API calls
 */

/**
 * Fetches available booking times for a given date
 * @param {Date} date - Selected date
 * @returns {Array<string>} Available time slots
 */
export const fetchAPI = (date) => {
  // Simulate API call
  const times = [
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00'
  ];

  // Return all available times
  return times;
};

/**
 * Submits booking data to API
 * @param {Object} formData - Booking details
 * @returns {boolean} Success status
 */
export const submitAPI = (formData) => {
  // Simulate API submission
  console.log('Booking submitted:', formData);
  
  // Simulate 90% success rate
  return Math.random() > 0.1;
};