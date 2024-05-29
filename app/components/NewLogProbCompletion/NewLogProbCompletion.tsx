import React, { useState } from "react";
import { returnDownForwardOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import styles from "./NewLogProbCompletion.module.css";
import {
  createChatCompletion,
  createChatCompletionLogProb,
} from "../../utils/functions";
import OpenAI from "openai";
import { WordItem } from "@/app/utils/treeNode";

type NewLogProbCompletionProps = {
  uniqueKey: number;
  id: string;
  wordItems: WordItem;
  // handleWordClick: (word: string, logProbs: any) => void,
  logProb: any;
  logProbs: any;
  searchWord: (node: WordItem, target: string) => WordItem | null | undefined;
};

const NewLogProbCompletion: React.FC<NewLogProbCompletionProps> = ({
  uniqueKey,
  wordItems,
  // handleWordClick,
  logProb,
  logProbs,
  searchWord,
}) => {
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [splitString, setSplitString] = useState<string>("");

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
    // Split string
    const splitWord: string = newStrings.join("");
    setSplitString(splitWord);
    const completionContent: OpenAI.ChatCompletion.Choice =
      await createChatCompletion(splitString);
    console.log(completionContent);
    const parent = wordItems.completionContent;

    // wordItems.addChild(
    //   new WordItem([], logProbs, splitWord, completionContent)
    // );

    searchWord(wordItems, splitString)?.completionContent?.message.content;
    // console.log(wordItems);
    // const wordNode: WordItem | null | undefined = searchWord(
    //   wordItems,
    //   splitWord
    // );
    // console.log(wordNode);
    // console.log(
    //   `where is my node ${wordNode?.completionContent?.message.content}`
    // );
    // console.log("node disaapeared");
  };

  return (
    <span
      className={styles.token}
      key={uniqueKey}
      style={{
        color: colorScaler(logProb.logprob),
        cursor: "pointer",
      }}
      onClick={() => handleWordClick(logProb.token, logProbs)}
    >
      {logProb.token}
      {logProb.token === selectedWord && (
        <>
          <div className={styles.icon}>
            <IonIcon
              // name="returnDownForwardOutline"
              icon={returnDownForwardOutline}
              size="small"
            ></IonIcon>
            {
              searchWord(wordItems, splitString)?.completionContent?.message
                .content
            }
            hello
          </div>
        </>
      )}
    </span>
  );
};

export default NewLogProbCompletion;

// save points
// <span
//   className={styles.token}
//   key={key}
//   style={{
//     color: colorScaler(logProb.logprob),
//     cursor: "pointer",
//   }}
//   onClick={() => handleWordClick(logProb.token, logProbs)}
// >
//   {logProb.token}
//   {logProb.token === selectedWord && (
//     <>
//       <IonIcon
//         icon={returnDownForwardOutline}
//         size="large"
//       ></IonIcon>
//     </>
//   )}
// </span>
