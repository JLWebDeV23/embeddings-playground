import React, { useState } from "react";
import { returnDownForwardOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import styles from "./NewLogProbCompletion.module.css";
import { openai } from "../../utils/functions";

type NewLogProbCompletionProps = {
    newLogProb: any;
}

const NewLogProbCompletion: React.FC<NewLogProbCompletionProps> = ({newLogProb}) => {
    const [logProb, setLogProb] = useState<any>([]);

    const createLogProb = async (input: string) => {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: input }],
            model: "gpt-3.5-turbo",
            logprobs: true,
            top_logprobs: 2,
            temperature: 0.0,
        });
        setLogProb(completion.choices[0].logprobs?.content);
    };

    const colorScaler = (logProb: number) => {
        const newLogProb = Math.exp(logProb);
        if (newLogProb < 1 && newLogProb > 0.998) {
          return "#D0E37F";
        } else {
          return "#d1603d";
        }
      };

  return (
    <div className={styles.newLogProbCompletion}>
      <IonIcon icon={returnDownForwardOutline} size="large"></IonIcon>
        <div>
            {/* {console.log(newLogProb)} */}
            {newLogProb.map((logProb: any, key: number) => {
            return (
              <span
                className={styles.token}
                key={key}
                style={{
                  color: colorScaler(logProb.logprob),
                  cursor: "pointer",
                }}
                // onClick={() => handleWordClick(logProb.token, key)}
              >
                {logProb.token}
              </span>
            );
          })}
        </div>
    </div>
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