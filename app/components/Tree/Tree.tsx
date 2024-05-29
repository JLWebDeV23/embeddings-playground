import React from "react";
import { TreeNode } from "../LogProb/LogProb";
import { createChatCompletionLogProb } from "../../utils/functions";
import { render } from "react-dom";

type TreeProps = {
  nodes: TreeNode[];
  addChildNode: (id: number, childNode: TreeNode) => void;
};

const Tree: React.FC<TreeProps> = ({ nodes, addChildNode }) => {
  const splitString = (str: string, node: TreeNode) => {
    const newString: string[] = [];
    for (const token of node.tokens) {
      if (token.token === str) {
        break;
      } else {
        newString.push(token.token);
      }
    }
    return newString.join("");
  };

  async function handleOnClick(
    node: TreeNode,
    token: { tokenId: number; token: string }
  ) {
    console.log(node.id);

    const newSplitString: string = splitString(token.token, node);
    const chatCompletion = await createChatCompletionLogProb(newSplitString);
    const completionContent = chatCompletion.message.content;
    const logProbs = chatCompletion.logprobs?.content;

    const id = Math.random();
    const tokens =
      logProbs?.map((logProb) => ({
        tokenId: Math.random(),
        token: logProb.token,
      })) || [];

    const childNode: TreeNode = {
      id: id,
      splitString: newSplitString,
      completionContent: completionContent,
      tokens: tokens,
      logProbs: logProbs,
      children: [],
    };
    console.log(childNode);
    addChildNode(node.id, childNode);
  }

  const renderTreeNode = (node: TreeNode) => {
    return (
      <div
        key={node.id}
        data-key={node.id}
        style={{ cursor: "pointer" }}
      >
        {node.tokens.map((token: { tokenId: number; token: string }) => {

          return (
            <span
              key={token.tokenId}
              data-key={token.tokenId}
              data-parent-key={node.id}
              onClick={() => handleOnClick(node, token)}
              style={{ cursor: "pointer" }}
            >
              {token.token}
            </span>
          );
        })}
        {node.children && node.children.map((child) => renderTreeNode(child))}
        
      </div>
    );
  };

  return <div>
    {nodes.map((node) => renderTreeNode(node))}
    
    {/* {renderTreeNode(nodes[0])} */}
     
  </div>;
};

export default Tree;