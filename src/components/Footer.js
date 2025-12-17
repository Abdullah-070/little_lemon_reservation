import React from 'react';

/**
 * Footer Component
 * Displays copyright and contact information
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Little Lemon</h3>
          <p>Chicago's finest Mediterranean restaurant</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <address>
            <p>123 Main Street<br />
            Chicago, IL 60601</p>
            <p>
              <a href="tel:+15551234567">(555) 123-4567</a><br />
              <a href="mailto:info@littlelemon.com">info@littlelemon.com</a>
            </p>
          </address>
        </div>

        <div className="footer-section">
          <h4>Hours</h4>
          <p>
            Mon-Thu: 11am - 10pm<br />
            Fri-Sat: 11am - 11pm<br />
            Sunday: 10am - 9pm
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Little Lemon. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;