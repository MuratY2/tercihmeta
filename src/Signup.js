// Signup.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css';
import Header from './Header';

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
    <div className={styles.signupContainer}>
      <Header />
      <div className={styles.signupContent}>
        <h2>Kayıt Ol</h2>
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
          <div className={styles.inputGroup}>
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
          <button type="submit" className={styles.btnPrimary}>
            Kaydol
          </button>
        </form>
        <p className={styles.loginPrompt}>
          Zaten hesabın var mı? <Link to="/login">Buradan giriş yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
