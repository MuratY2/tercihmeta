import React from 'react';
import Header from './Header'; // Ensure this import path is correct

function Main() {
  return (
    <div>
      <Header /> {/* Add Header component here */}
      <div className="main-content">
        <h2>Welcome to the Main Page</h2>
        <p>This is where users will land after logging in or continuing as a guest.</p>
        {/* Add additional content or functionality here */}
      </div>
    </div>
  );
}

export default Main;
