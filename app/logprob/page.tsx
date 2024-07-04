"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createChatCompletionLogProb } from "../utils/functions";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

type NodeAttributes = {
  history: string[];
  token: string;
  pendingChildrenAttributes?: NodeAttributes[];
  askForSibling?: () => void;
};

type NodeProps = NodeAttributes & React.PropsWithChildren<{}>;

/* 
  Node component is a recursive component that creates a tree structure.
*/
const Node = ({
  history,
  token,
  children,
  pendingChildrenAttributes,
  askForSibling,
}: NodeProps) => {
  const [childrenAttributes, setChildrenAttributes] = React.useState<
    NodeAttributes[]
  >([]);

  /* 
      handleClick is the function that is called the user clicks on the button.
      It tells the parent to create a new child node with chat completion logprobs.
    */
  const handleClick = () => {
    if (askForSibling) {
      askForSibling();
    } else {
      /* the initial node can't ask his parents to have a sibling */
      setChildrenAttributes((prev) => {
        return [
          ...prev,
          {
            history: [...history, token],
            token: token + 1,
          },
        ];
      });
    }
  };

  const handleAskForSibling = async () => {
    const response = (
      await createChatCompletionLogProb(history.join("") + token)
    ).logprobs?.content;
    if (response) {
      console.log(response);
      const [first, ...next] = response;
      const firstChild = {
        history: [...history],
        token: first.token,
        pendingChildrenAttributes: next.map((child) => {
          return {
            history: [...history, token, first.token],
            token: child.token,
          };
        }),
      };
      setChildrenAttributes((prev) => {
        return [...prev, firstChild];
      });
    }
  };

  const [nextChild, ...rest] = pendingChildrenAttributes || [];

  return (
    <div className="flex">
      <button className="whitespace-pre" onClick={handleClick}>
        {token}
      </button>
      <div className="flex flex-col">
        {children}
        {nextChild && (
          <Node
            key={uuidv4()}
            history={[...history, token]}
            token={nextChild.token}
            pendingChildrenAttributes={rest}
            askForSibling={handleAskForSibling}
          ></Node>
        )}
        {childrenAttributes.map((childrenAttribute, index) => {
          return (
            <Node
              key={uuidv4()}
              history={[...history, token]}
              token={childrenAttribute.token}
              pendingChildrenAttributes={
                childrenAttribute.pendingChildrenAttributes
              }
              askForSibling={handleAskForSibling}
            ></Node>
          );
        })}
      </div>
    </div>
  );
};

const Page = () => {
  const [value, setValue] = useState("");
    const [base, setBase] = useState<string>('')

  const nodes = (
    <Node history={[]} token={base}>
      {/* <Node history={["A"]} token="&nbsp;good">
                <Node history={["A", "&nbsp;good"]} token="&nbsp;day"></Node>
            </Node> */}
    </Node>
  );

  const handleSubmit = async () => {
    const message =(await createChatCompletionLogProb(value)).message.content;
    if (message) setBase(message)
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-2 max-w-[240px]">
        <Textarea
          variant="underlined"
          label="Description"
          labelPlacement="outside"
          placeholder="Enter your description"
          value={value}
          onValueChange={setValue}
        />
        <Button onPress={handleSubmit}>Submit</Button>
      </div>
      <div>{nodes}</div>
    </div>
  );
};

export default Page;
