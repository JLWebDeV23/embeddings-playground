import React, { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { createChatCompletionLogProb } from "@/app/utils/functions";
import OpenAI from "openai";

export type NodeAttributes = {
    history: OpenAI.ChatCompletionTokenLogprob[];
    token: OpenAI.ChatCompletionTokenLogprob;
    pendingChildrenAttributes?: NodeAttributes[];
    askForSibling?: (token: OpenAI.ChatCompletionTokenLogprob) => void;
};

export type NodeProps = NodeAttributes;

/* 
  Node component is a recursive component that creates a tree structure.
*/
export default function Node({
    history,
    token,
    pendingChildrenAttributes,
    askForSibling,
}: NodeProps) {
    const [childrenAttributes, setChildrenAttributes] = React.useState<
        NodeAttributes[]
    >([]);

    /* 
      handleAskForSibling is the function that is called when a child asks for a sibling (when the user clicks on a child's button)
      It creates a new child node with chat completion logprobs.
    */
    const handleAskForSibling = useCallback(
        async (childrenToken: OpenAI.ChatCompletionTokenLogprob) => {
            // Get the logprobs from the API
            // const generateToken = childrenToken.token !== childrenToken.top_logprobs[1].token ? childrenToken.top_logprobs[1] : childrenToken.top_logprobs[2];
            // destructure childrenToken get he childrenToken.token and ...rest  if childrenToken.token !== childrenToken.top_logprobs[1].token assign childrenToken.top_logprobs[1] to childrenToken.token else assign childrenToken.top_logprobs[2] to childrenToken.token return as an element of OpenAI.ChatCompletionTokenLogprob type
            const { token, top_logprobs, ...rest } = childrenToken;
            const newToken =
                token.toLowerCase() !== top_logprobs[1].token.toLowerCase()
                    ? top_logprobs[1].token
                    : top_logprobs[2].token;
            const generateToken: OpenAI.ChatCompletionTokenLogprob = {
                token: newToken,
                top_logprobs: top_logprobs,
                ...rest,
            };

            const logProbInput =
                history
                    .map((_) => {
                        return _.token;
                    })
                    .join("") + generateToken.token;
            const response = (await createChatCompletionLogProb(logProbInput))
                .logprobs?.content;
            if (response) {
                const newResponse: typeof response = [
                    generateToken,
                    ...response,
                ];
                console.log(newResponse);
                const [first, ...next] = newResponse;
                const firstChild: NodeAttributes = {
                    history: [...history],
                    token: first,
                    /* Tells the child which childen he should generate next */
                    pendingChildrenAttributes: next.map((child) => {
                        return {
                            history: [...history, first],
                            token: child,
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
        },
        [history]
    );

    const handleClick = useCallback(() => {
        if (askForSibling) {
            askForSibling(token);
        } else {
            /* the initial node can't ask his parents to have a sibling so we generate a child instead */
            handleAskForSibling(token);
        }
    }, [askForSibling, handleAskForSibling, token]);

    const [nextChild, ...rest] = pendingChildrenAttributes || [];

    return useMemo(
        () => (
            <div className="flex">
                <button className="whitespace-pre" onClick={handleClick}>
                    {token.token}
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
