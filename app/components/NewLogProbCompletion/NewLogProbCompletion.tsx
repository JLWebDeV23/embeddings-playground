import React, { useState } from "react";
import { returnDownForwardOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import styles from "./NewLogProbCompletion.module.css";
import {
  createChatCompletion,
  createChatCompletionLogProb,
} from "../../utils/functions";
import { openai } from "../../utils/functions";
import OpenAI from "openai";
import { WordItem } from "@/app/utils/treeNode";

type NewLogProbCompletionProps = {
  key: string;
  wordItems: WordItem;
  // handleWordClick: (word: string, logProbs: any) => void,
  logProb: any;
  logProbs: any;
};

const NewLogProbCompletion: React.FC<NewLogProbCompletionProps> = ({
  key,
  wordItems,
  // handleWordClick,
  logProb,
  logProbs,
}) => {
  const [selectedWord, setSelectedWord] = useState<string>("");

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

  const handleWordClick = async (word: string, logProbs: any) => {
    setSelectedWord(word);
    const newStrings: string[] = [];
    for (const logProb of logProbs) {
      if (logProb.token === word) {
        break;
      } else {
        newStrings.push(logProb.token);
      }
    }
    const splitWord: string = newStrings.join("");
    const completionContent: OpenAI.ChatCompletion.Choice =
      await createChatCompletion(splitWord);
    console.log(completionContent);
    const parent = wordItems.completionContent;
    console.log("My Parent: " + logProbs);

    wordItems.addChild(
      new WordItem([], logProbs, splitWord, completionContent)
    );
    console.log(
      splitWord + ": " + "Generated: " + completionContent.message.content
    );
    console.log(wordItems);
  };

  return (
    <span
      className={styles.token}
      // key={key}
      style={{
        color: colorScaler(logProb.logprob),
        cursor: "pointer",
      }}
      onClick={() => handleWordClick(logProb.token, logProbs)}
    >
      {logProb.token}
      {logProb.token === selectedWord && (
        <>
          <IonIcon icon={returnDownForwardOutline} size="large"></IonIcon>
        </>
      )}
    </span>
  );
};

export default NewLogProbCompletion;

// A dog is a domesticated mammal that belongs to the Canidae family. They are known for their loyalty, companionship, and ability to be trained for various tasks. Dogs come in a wide variety of breeds, each with their own unique characteristics and traits. They are often kept as pets and are known for their close bond with humans.

// return (
//     <span
//     // className={styles.token}
//     key={key}
//     style={{
//       color: colorScaler(logProb.logprob),
//       cursor: "pointer",
//     }}
//     onClick={() => handleWordClick(logProb.token, key)}
//   >
//     {logProb.token}
//     {logProb.token === selectedWord && (
//       <>
//         <p>Ka-chow</p>
//       </>
//     )}
//   </span>
// )
