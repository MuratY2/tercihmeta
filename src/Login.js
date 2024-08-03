// Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css';
import Header from './Header'; // Import the Header component

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement login logic here
    console.log('Login:', { email, password });
  };

  return (
    <div className={styles.signupContainer}>
      <Header /> {/* Add Header component here */}
      <div className={styles.signupContent}>
        <h2>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
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
          <div className={styles.inputGroup}>
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
          <button type="submit" className={styles.btnPrimary}>
            Giriş Yap
          </button>
        </form>
        <p className={styles.loginPrompt}>
          Henüz hesabınız yok mu? <Link to="/signup">Buradan kaydol</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
