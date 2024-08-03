import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure Link is imported
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Ensure this import is correctly configured
import styles from './Signup.module.css'; // Ensure this is the right CSS file
import Header from './Header'; // Verify Header is importing correctly

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for redirecting

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/main'); // Redirect to main page if user is logged in
      }
    });

    return unsubscribe; // Cleanup subscription
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous error on new submission
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/main'); // Redirect to main page after successful login
    } catch (error) {
      setError(error.message); // Set error message if login fails
    }
  };

  return (
    <div className={styles.signupContainer}>
      <Header />
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
          {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>{error}</div>}
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
