import React, { use, useState } from "react";
import styles from "./LogProb.module.css";
import TextBox from "../TextBox/TextBox";
import { WordItem } from "@/app/utils/treeNode";
import { createChatCompletionLogProb } from "../../utils/functions";
import OpenAI from "openai";
import NewLogProbCompletion from "../NewLogProbCompletion/NewLogProbCompletion";

const LogProb = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [logProbs, setLogProbs] = useState<any>([]);
  const [myParent, setMyParent] = useState<OpenAI.ChatCompletion.Choice | null>(null);
  let wordItems = new WordItem([], null, '', null);

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
    const completionLogProb: OpenAI.ChatCompletion.Choice = await createChatCompletionLogProb(inputValue);
    // array of logprobs objects
    const logProbs = completionLogProb.logprobs?.content;

    // add to wordItems
    wordItems.completionContent = completionLogProb;
    setMyParent(completionLogProb);
    setLogProbs(logProbs);
    setInputValue("");
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
          {logProbs.map((logProb: any, key: string, logProbs: any) => {
            return (
              <NewLogProbCompletion key={key} wordItems={wordItems} logProb={logProb} logProbs={logProbs} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogProb;
