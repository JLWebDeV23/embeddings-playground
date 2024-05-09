import React from "react";
import logoImage from "../../images/logo-image.png";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header>
      <a href="/" className={styles.logoContainer}>
        <img src={logoImage.src} alt="Home page icon" className={styles.logoImage} />
        <span className={styles.logo}>
          Embedding Playground <span style={{ color: "var(--red)" }}>UI</span>
        </span>
      </a>
    </header>
  );
};

export default Header;
