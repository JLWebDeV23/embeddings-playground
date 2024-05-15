import React, { use, useState } from "react";
import styles from "./LogProb.module.css";
import TextBox from "../TextBox/TextBox";
import { openai } from "../../utils/functions";
import { returnDownForwardOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { WordItem } from "@/app/utils/treeNode";
import { createChatCompletion, createChatCompletionLogProb } from "../../utils/functions";
import { split } from "postcss/lib/list";

const LogProb = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [completionMessage, setCompletionMessage] = useState<string>("");
  const [logProbs, setLogProbs] = useState<any>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  // const [wordItems, setWordItems] = useState<any>([]);
  const items: any[] = [];

  /**
   * Color the tokens based on their log probabilities.
   * high -> low
   * green -> blue -> purple -> orange -> red
   *
   */
  const colorScaler = (logProb: number) => {
    const newLogProb = Math.exp(logProb);
    if (newLogProb < 1 && newLogProb > 0.998) {
      return "#D0E37F";
    } else {
      return "#d1603d";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputValue);
    const completionLogProb = (await createChatCompletionLogProb(inputValue)).logprobs?.content;
    setLogProbs(completionLogProb);
    setInputValue("");
  };

  const handleWordClick = async (word: string, logProbs: any) => {
    // console.log("WordClick: " + word);
    // setSelectedWord(word);
    // console.log(selectedWord);
    // console.log(items.map((wordItem: any) => wordItem.token).join(""));
    const newStrings: string[] = [];
    for (const logProb of logProbs) {
      if (logProb.token === word) {
        break;
      } else {
        newStrings.push(logProb.token);
      }
    }
    const splitWord: string = newStrings.join("");
    console.log(splitWord + ": "+ "Generated: " + await createChatCompletion(splitWord));
    // const newStrings = logProbs.map((logProb: any) => logProb.token);
    // console.log(logProbs.map((logProb: any) => logProb.token !== word));
  };
  const addWordItems = (logProb: any) => {
    items.push(logProb);

    // console.log("WordItems: " + wordItems);
  };

  return (
    <section className={styles.logprob}>
      <TextBox
        placeholder="Type something..."
        nameBtn="Add"
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <div className={styles.tokenizer}>
        <div className={styles.generatedResponse}>
          {logProbs.map((logProb: any, key: number, logProbs: any) => {
            addWordItems(logProb);
            // console.log("My logProb: " + logProb);
            return (
              <span
                className={styles.token}
                key={key}
                style={{
                  color: colorScaler(logProb.logprob),
                  cursor: "pointer",
                }}
                onClick={() => handleWordClick(logProb.token, logProbs)}
              >
                {logProb.token}
                {logProb.token === selectedWord && (
                  <>
                    <IonIcon
                      icon={returnDownForwardOutline}
                      size="large"
                    ></IonIcon>
                  </>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogProb;
