// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from './logo.png'; // Make sure to have a logo file in the same directory or adjust the path accordingly

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.homeLink}>
        <img src={logo} alt="TercihMeta Logo" className={styles.logo} />
        <span className={styles.title}>TercihMeta</span>
      </Link>
    </header>
  );
}

export default Header;
