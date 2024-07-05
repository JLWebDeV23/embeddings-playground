"use client";
import React, { useCallback, useMemo, useState } from "react";
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

type NodeProps = NodeAttributes;

/* 
  Node component is a recursive component that creates a tree structure.
*/
const Node = ({
    history,
    token,
    pendingChildrenAttributes,
    askForSibling,
}: NodeProps) => {
  const [childrenAttributes, setChildrenAttributes] = React.useState<
    NodeAttributes[]
  >([]);

    /* 
      handleAskForSibling is the function that is called when a child asks for a sibling (when the user clicks on a child's button)
      It creates a new child node with chat completion logprobs.
    */
    const handleAskForSibling = useCallback(async () => {
        // Get the logprobs from the API
        const response = (
            await createChatCompletionLogProb(history.join("") + token)
        ).logprobs?.content;
        if (response) {
            console.log(response);
            const [first, ...next] = response;
            const firstChild = {
                history: [...history],
                token: first.token,
                /* Tells the child which childen he should generate next */
                pendingChildrenAttributes: next.map((child) => {
                    return {
                        history: [...history, token, first.token],
                        token: child.token,
                    };
                }),
            };
            // Add the first child to the childrenAttributes state so it will be rendered
            setChildrenAttributes((prev) => {
                console.log({ prev, firstChild });
                return [...prev, firstChild];
            });
        } else {
            console.error("No response");
        }
    }, [history, token]);

    const handleClick = useCallback(() => {
        if (askForSibling) {
            askForSibling();
        } else {
            /* the initial node can't ask his parents to have a sibling so we generate a child instead */
            handleAskForSibling();
        }
    }, [askForSibling, handleAskForSibling]);

    const [nextChild, ...rest] = pendingChildrenAttributes || [];

    return useMemo(
        () => (
            <div className="flex">
                <button className="whitespace-pre" onClick={handleClick}>
                    {token}
                </button>
                <div className="flex flex-col">
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
        ),
        [
            token,
            nextChild,
            history,
            rest,
            childrenAttributes,
            handleAskForSibling,
            handleClick,
        ]
    );
}

const Page = () => {
  const [value, setValue] = useState("");
  const [base, setBase] = useState<NodeAttributes[]>([]);

  const nodes = (
    <Node history={[]} token={""} pendingChildrenAttributes={base}></Node>
  );

  const handleSubmit = async () => {
    const messages = (await createChatCompletionLogProb(value)).logprobs
      ?.content;
    console.log(messages);
    if (messages)
      setBase(
        messages.map((message) => ({
          token: message.token,
          history: [],
        }))
      );
  };

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
          //Todo: Enter not workig yet
          onKeyDown={(key) => {
            if (key.key === "Enter" && !key.shiftKey) {
              handleSubmit();
            }
          }}
        />
        <Button onPress={handleSubmit}>Submit</Button>
      </div>
      <div>{nodes}</div>
    </div>
  );
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
