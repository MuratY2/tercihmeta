// Signup.js
import React, { useState } from 'react';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement signup logic here
    console.log('Signup:', { email, password, confirmPassword });
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email adresinizi girin"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Şifrenizi girin"
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Şifreyi Onayla</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Şifrenizi tekrar girin"
            />
          </div>
          <button type="submit" className="btn primary">Kaydol</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
