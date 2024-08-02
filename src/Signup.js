// Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './Signup.module.css'; // Import the CSS module

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to the main page after successful signup
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupContent}>
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          <button type="submit" className={styles.primary}>
            Kaydol
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
