import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase'; // Ensure this path is correct
import styles from './Header.module.css';
import logo from './logo1.png'; // Adjust the path if necessary

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.homeLink}>
        <img src={logo} alt="TercihMeta Logo" className={styles.logo} />
        <span className={styles.title}>TercihMeta</span>
      </Link>
      <div className={styles.accountMenu}>
        <div className={styles.dropdown}>
          <div className={styles.dropdownToggle}>
            Hesabım
          </div>
          <div className={styles.dropdownContent}>
            {user ? (
              <>
                <span className={styles.userEmail}>{user.email}</span>
                <span className={styles.authLink} onClick={handleLogout}>
                  Çıkış Yap
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.authLink}>Giriş Yap</Link>
                <Link to="/signup" className={styles.authLink}>Kaydol</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
