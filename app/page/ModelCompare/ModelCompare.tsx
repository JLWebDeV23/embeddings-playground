require("dotenv").config();
import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { repeatOutline } from "ionicons/icons";
import styles from "./ModelCompare.module.css";
import TextBox from "@/app/components/TextBox/TextBox";
import TextArea from "@/app/components/TextArea/TextArea";
import { createChatCompletion, createTest, createTest1 } from "@/app/utils/functions";
import { createEmbedding, modelResponse, createCosineSimilarity } from "@/app/utils/modelProcessing"


const ModelCompare = () => {
  // const [show, setShow] = useState(false);
  // const [numbers, setNumbers] = useState([2,3,4]);
  const [inputValue, setInputValue] = useState("");
  const handleTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TESTING FOR SIMILARITY
      // GPT
    const completion: string | null = (await createTest(inputValue)).message.content;
      // Llama
    const completion1: string | null = (await createTest1(inputValue)).message.content;
    // similarity between the two completions      
    console.log(await createCosineSimilarity(completion, completion1));
    
    console.log("GPT: " + completion);
    console.log("Llama: " + completion1);

  };
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
          <IonIcon
            icon={repeatOutline}
            size="large"
          />
        </div>
        <input type="text" className={styles.input} />
        <button></button>
      </div>
      <TextBox
        placeholder="System Prompt . . ."
        nameBtn="Save"
        inputValue={inputValue}
        handleInputChange={handleTestChange}
        handleFormSubmit={handleSubmit}
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
