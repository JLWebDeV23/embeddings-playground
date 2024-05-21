import React, { useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { repeatOutline } from "ionicons/icons";
import styles from "./ModelCompare.module.css";
import TextBox from "@/app/components/TextBox/TextBox";
import TextArea from "@/app/components/TextArea/TextArea";

const ModelCompare = () => {
  // const [show, setShow] = useState(false);
  // const [numbers, setNumbers] = useState([2,3,4]);

  return (
    // <section className="modelCompare" style={{`display: ${show ? 'flex':'none'}`}
    // <div className="replace" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>

    // {
    //     numbers.map((number: number) => <div>{number}</div>)
    // }
    <div className={styles.modelCompare}>
      <div className={styles.replace}>
        <input type="text" className={styles.input} />
        <div className="ml-1 mr-1">
          <IonIcon icon={repeatOutline} size="large" />
        </div>
        <input type="text" className={styles.input} />
        <button></button>
      </div>
      <TextBox
        placeholder="System Prompt . . ."
        nameBtn="Submit"
        inputValue=""
        handleInputChange={() => {}}
        handleFormSubmit={() => {}}
      />
      <TextArea />
      <div className={styles.result}>
        <div className={styles.resultItem}>
          <TextBox
            placeholder="System Prompt . . ."
            nameBtn="Submit"
            inputValue=""
            handleInputChange={() => {}}
            handleFormSubmit={() => {}}
          />
        </div>
        <div className={styles.resultItem}>
          <textarea className={styles.output} id=""></textarea>
        </div>
      </div>
    </div>
  );
};

export default ModelCompare;
