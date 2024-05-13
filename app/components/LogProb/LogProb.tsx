import React, { useState } from "react";
import styles from "./LogProb.module.css";
import TextBox from "../TextBox/TextBox";
import { createEmbedding, openai } from "../../utils/functions";
import { log } from "console";
import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants";

const LogProb = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const createLogProb = async (input: string) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "gpt-3.5-turbo",
      logprobs: true,
      top_logprobs: 2,
    });
    let probsResult: Array<any> = [];
    const logProbs = completion.choices[0].logprobs?.content;
    console.log(logProbs, typeof logProbs);
    logProbs?.forEach((logProb: any, index: number) => {
      const output = `${logProb.token}: ${logProb.logprob}
${logProb.top_logprobs[0].token}: ${logProb.top_logprobs[0].logprob}
${logProb.top_logprobs[1].token}: ${logProb.top_logprobs[1].logprob}
\n
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

  return (
    <section className={styles.logprob}>
      <TextBox
        placeholder="Type something..."
        nameBtn="Add"
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
    </section>
  );
};

export default LogProb;
