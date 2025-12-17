import React from 'react';

/**
 * Header Component
 * Displays restaurant logo and main heading
 */
function Header() {
  return (
    <header className="header" role="banner">
      <div className="header-content">
        <img
          src="/logo.png"
          alt="Little Lemon restaurant logo"
          className="logo"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <h1>Little Lemon</h1>
        <p className="tagline">Chicago's finest Mediterranean restaurant</p>
      </div>
    </header>
  );
}

export default Header;