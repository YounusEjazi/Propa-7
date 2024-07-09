// src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>© 2024 Universität Siegen. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
          <Link to="/contact-us" className={styles.footerLink}>Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
