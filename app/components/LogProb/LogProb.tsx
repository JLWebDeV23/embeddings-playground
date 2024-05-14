import React, { use, useState } from "react";
import styles from "./LogProb.module.css";
import TextBox from "../TextBox/TextBox";
import { openai } from "../../utils/functions";

const LogProb = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [completionMessage, setCompletionMessage] = useState<string>("");
  const [logProbs, setLogProbs] = useState<any>([]);
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

  const createLogProb = async (input: string) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "gpt-3.5-turbo",
      logprobs: true,
      top_logprobs: 2,
      temperature: 0.0,
    });

    console.log(completion.choices[0].message.content);
    setCompletionMessage(completion.choices[0].message.content!);
    let probsResult: Array<any> = [];
    const logProbs = completion.choices[0].logprobs?.content;
    setLogProbs(logProbs);
    console.log(logProbs, typeof logProbs);
    logProbs?.forEach((logProb: any) => {
      const output = `${logProb.token}: ${logProb.logprob}
${logProb.top_logprobs[0].token}: ${logProb.top_logprobs[0].logprob}
${logProb.top_logprobs[1].token}: ${logProb.top_logprobs[1].logprob}
`;
      probsResult.push(output);
    });
    probsResult.map((prob) => console.log(prob));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputValue);
    const logProbs = createLogProb(inputValue);
    setInputValue("");
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    console.log(selectedWord);
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
          {logProbs.map((logProb: any, key: number) => {
            return (
              <span
                className={styles.token}
                key={key}
                style={{
                  color: colorScaler(logProb.logprob),
                  cursor: "pointer",
                }}
                onClick={() => handleWordClick(logProb.token)}
              >
                {logProb.token}
                {logProb.token === selectedWord && (
                  <>
                    <ion-icon name="return-down-forward-outline"></ion-icon>
                    <p>Ka-chow</p>
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
