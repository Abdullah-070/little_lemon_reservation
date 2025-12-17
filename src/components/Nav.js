import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigation Component
 * Provides site navigation with accessibility support
 */
function Nav() {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <ul>
        <li>
          <Link to="/" aria-label="Go to home page">Home</Link>
        </li>
        <li>
          <Link to="/" aria-label="Go to booking page">Book a Table</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;