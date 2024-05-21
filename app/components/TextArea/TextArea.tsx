import React from "react";
import styles from "./TextArea.module.css";
import { IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";

type TextAreaProps = {
  // nameBtn: string;
};

const TextArea: React.FC<TextAreaProps> = ({}) => {
  return (
    <div className={styles.container}>
      <div className={styles.entryArea}>
        <textarea id="textArea" required></textarea>
        <div className={styles.labelLine}>Message</div>
        <button
          className={`btn ${styles.buttonCustom}`}
        >
          Add
        </button>
      </div>
      
    </div>
  );
};

export default TextArea;
