import React from 'react';
import styles from './PopUp.module.css';

const PopUp = () => {
  return (
    <div className={styles.popup} id="popup">
      <div className={styles.overlay}></div>
      <div className={styles.popupContent}>
        <h2>This is Pop</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint eaque
          quo minima pariatur, similique veniam ipsam delectus praesentium ullam
          molestias tempore, voluptatibus, mollitia libero. Quam obcaecati
          explicabo laborum tenetur dolore!
        </p>
        <div className={styles.controls}>
          <button className={styles.cancelBtn}>cancel</button>
          <button className={styles.confrimBtn}>confirm</button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
