// Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Ensure this path is correct
import styles from './Signup.module.css';
import Header from './Header';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/main');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <Header />
      <div className={styles.signupContent}>
        <h2>Kayıt Ol</h2>
        {error && <p className={styles.error}>{error}</p>}
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
          <button type="submit" className={styles.btnPrimary}>Kaydol</button>
        </form>
        <p className={styles.loginPrompt}>
          Zaten hesabınız var mı? <Link to="/login">Buradan giriş yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
