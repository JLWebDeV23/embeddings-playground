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
            /* the initial node can't ask his parents to have a sibling so we generate a child instead */
            handleAskForSibling();
        }
    };

    /* 
      handleAskForSibling is the function that is called when a child asks for a sibling (when the user clicks on a child's button)
      It creates a new child node with chat completion logprobs.
    */
    const handleAskForSibling = async () => {
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
                return [...prev, firstChild];
            });
        } else {
            console.error("No response");
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
    const [base, setBase] = useState<NodeAttributes[]>([]);

    const nodes = (
        <Node history={[]} token={""} pendingChildrenAttributes={base}>
            {/* <Node history={["A"]} token="&nbsp;good">
                <Node history={["A", "&nbsp;good"]} token="&nbsp;day"></Node>
            </Node> */}
        </Node>
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
};

export default Page;
