import React, { use, useState } from "react";
import styles from "./LogProb.module.css";
import TextBox from "../TextBox/TextBox";
import { WordItem } from "@/app/utils/treeNode";
import { createChatCompletionLogProb } from "../../utils/functions";
import OpenAI from "openai";
import NewLogProbCompletion from "../NewLogProbCompletion/NewLogProbCompletion";
import Tree from "../Tree/Tree";
import { Sentence } from "@/app/utils/newTreeNode";
import { LogProbTreeNode } from "@/app/utils/interfaces";
import NewLogProb from "../NewLogProb/NewLogProb";

export interface TreeNode {
  id: number;
  splitString: string | null;
  completionContent: string | null;
  tokens: { token: string; tokenId: number }[];
  logProbs?: OpenAI.Chat.Completions.ChatCompletionTokenLogprob[] | null;
  children?: TreeNode[];
}

// const logProbNode: LogProbTreeNode[] = null;

const nodes: TreeNode[] = [];
// const LogProb = () => {

// // Tree
// let sentences = new Sentence(0, '', [], null, null);

//   const [inputValue, setInputValue] = useState<string>("");
//   const [logProbs, setLogProbs] = useState<OpenAI.Chat.Completions.ChatCompletionTokenLogprob[] | null | undefined
//   >([] as OpenAI.Chat.Completions.ChatCompletionTokenLogprob[] | null | undefined
//   );
//   const [myParent, setMyParent] = useState<OpenAI.ChatCompletion.Choice | null>(null);
//   let wordItems = new WordItem([], null, '', null);

//   /**
//    * Color the tokens based on their log probabilities.
//    * high -> low
//    * green -> blue -> purple -> orange -> red
//    *
//    */
//   const colorScaler = (logProb: number) => {
//     const newLogProb = Math.exp(logProb);
//     if (newLogProb < 1 && newLogProb > 0.998) {
//       return "#D0E37F";
//     } else {
//       return "#d1603d";
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleFormSubmit = async (e: React.FormEventsss<HTMLFormElement>) => {
//     e.preventDefault();

//     const completionLogProb: OpenAI.ChatCompletion.Choice = await createChatCompletionLogProb(inputValue);
//     // array of logprobs objects
//     const logProbs: OpenAI.Chat.Completions.ChatCompletionTokenLogprob[] | undefined | null
//     = completionLogProb.logprobs?.content;

//     // add to sentences
//     sentences.name = completionLogProb.message.content!;
//     sentences.completionContent = completionLogProb;

//     // add to wordItems
//     wordItems.completionContent = completionLogProb;
//     setMyParent(completionLogProb);
//     setLogProbs(logProbs);

//     console.log(logProbs);

//     setInputValue("");
//   };

//   const searchWord = (node: WordItem, target: string): WordItem | null | undefined => {
//     console.log(target);
//     // Check if the current node is the target
//     // target is only a word whereas node.split is a sentence
//     if (node.split === target) {
//       console.log("Found the target!")
//       console.log(`Node: ${String(node.split)} Target: ${target}`)
//       return node;
//     }

//     // Recursively search for the target in the children of the current node
//     for (const child of node.children) {
//       const result = searchWord(child, target);
//       if (result !== null) {
//         return result;
//       }
//     }
//   }

//   return (
//     <section className={styles.logprob}>
//       <TextBox
//         placeholder="Type something..."
//         nameBtn="Add"
//         inputValue={inputValue}
//         handleInputChange={handleInputChange}
//         handleFormSubmit={handleFormSubmit}
//       />
//       <Tree sentences={sentences} />

//       <div className={styles.tokenizer}>
//         <div className={styles.generatedResponse}>
//           {logProbs!.map((logProb: any, index: number, logProbs: any) => {
//             return (
//               <NewLogProbCompletion uniqueKey={index} id={index.toString()} wordItems={wordItems} logProb={logProb} logProbs={logProbs} searchWord={searchWord} />
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LogProb;

const LogProb = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [logProbNode, setLogProbNode] = useState<LogProbTreeNode[]>([]);

  const appendNode = (node: TreeNode) => {
    setNodes([...nodes, node]);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const completion: OpenAI.ChatCompletion.Choice =
      await createChatCompletionLogProb(inputValue);

    // root properties
    const logProbNode: LogProbTreeNode = {
      token: completion.message.content,
      id: 0,
      logProbs: completion,
      children: [],
    };

    // const completionContent: string | null = completionLogProb.message.content;

    // // add root to the tree
    // nodes.push({
    //   id: Math.random(),
    //   splitString: null,
    //   completionContent: completionContent,
    //   tokens:
    //     logProbs?.map((logProb) => ({
    //       token: logProb.token,
    //       tokenId: Math.random(),
    //     })) || [],
    //   logProbs: completionLogProb.logprobs?.content,
    //   children: [],
    // });
    // console.log(nodes);

    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const addLogProbChild = (token: string) => {
    console.log(token);
  };

  // id == parent id
  const addChildNode = (id: number, childNode: TreeNode) => {
    const newNode = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node, // create all the properties of the found node
          children: [
            ...(node.children ?? []),
            {
              id: childNode.id,
              children: childNode.children,
              splitString: childNode.splitString,
              completionContent: childNode.completionContent,
              tokens: childNode.tokens,
              logProbs: childNode.logProbs,
            },
          ],
        };
      }
      return node;
    });
    setNodes(newNode as TreeNode[]);
    console.log(nodes);
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
      <Tree nodes={nodes} addChildNode={addChildNode} />
      <NewLogProb logProbNode={logProbNode} />
    </section>
  );
};

export default LogProb;
