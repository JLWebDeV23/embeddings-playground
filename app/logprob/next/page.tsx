"use client";
import { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { createChatCompletionLogProb } from "@/app/utils/functions";
import { last } from "lodash";

type Token = OpenAI.ChatCompletionTokenLogprob;

type NodeAttributes = {
    token?: Token;
    id: string;
    parent?: NodeAttributes;
    children: NodeAttributes[];
    askForSibling: (id: string) => void;
};

const recursiveFind = (
    id: string,
    node: NodeAttributes
): NodeAttributes | null => {
    if (node.id === id) {
        return node;
    }
    for (const child of node.children) {
        const result = recursiveFind(id, child);
        if (result) {
            return result;
        }
    }
    return null;
};

/* Function to get the token history of a node */
const getHistory = (node: NodeAttributes): Token[] => {
    if (!node.token) {
        return [];
    }
    return node.parent?.token ? [...getHistory(node.parent), node.token] : [];
};

function Node({ children, token, askForSibling, id }: NodeAttributes) {
    const handleAskForSibling = useMemo(() => {
        return () => {
            askForSibling(id);
        };
    }, [id, askForSibling]);
    return useMemo(
        () => (
            <div className="flex">
                <button
                    className="whitespace-pre"
                    onClick={handleAskForSibling}
                >
                    {token?.token}
                </button>
                <div className="flex flex-col">
                    {children.map((child) => (
                        <Node
                            id={child.id}
                            key={child.id}
                            parent={child}
                            token={child.token}
                            askForSibling={askForSibling}
                        >
                            {child.children}
                        </Node>
                    ))}
                </div>
            </div>
        ),
        [token, children, askForSibling, handleAskForSibling]
    );
}

export default function Page() {
    const [data, setData] = useImmer<NodeAttributes>({
        id: uuidv4(),
        children: [
            {
                id: uuidv4(),
                token: {
                    token: "Hello",
                    top_logprobs: [
                        {
                            token: "Hello",
                            bytes: [],
                            logprob: -0.1,
                        },
                        {
                            token: "Hi",
                            bytes: [],
                            logprob: -0.2,
                        },
                        {
                            token: "Hey",
                            logprob: -0.3,
                            bytes: [],
                        },
                    ],
                    bytes: [],
                    logprob: 0,
                },
                children: [],
                askForSibling: () => {},
            },
        ],
        askForSibling: () => {},
    });

    const handleAskForSibling = useCallback(
        async (id: string) => {
            const elem = recursiveFind(id, data);
            if (!elem) {
                throw new Error("Element not found");
            }
            if (!elem.token) {
                throw new Error("Element has no token");
            }
            const { token, top_logprobs, ...rest } = elem.token;
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
                getHistory(elem)
                    .map((parentToken) => {
                        return parentToken.token;
                    })
                    .join("") + generateToken.token;
            console.log(elem, data, id);
            const res = await createChatCompletionLogProb(logProbInput);
            const response = res.logprobs?.content;
            if (!response) {
                throw new Error("No response");
            }
            const newResponse: typeof response = [generateToken, ...response];

            const reccursiveGenerateChildren = (
                newResponse: Token[],
                elem: NodeAttributes
            ): NodeAttributes[] => {
                const [first, ...next] = newResponse;
                if (!first) {
                    return [];
                }
                return [
                    {
                        token: first,
                        id: uuidv4(),
                        parent: elem,
                        children: reccursiveGenerateChildren(next, elem),
                        askForSibling: () => {},
                    },
                ];
            };

            setData((draft) => {
                const draftParent = recursiveFind(elem.parent?.id || id, draft);
                if (!draftParent) {
                    throw new Error("Parent not found");
                }
                if (draftParent) {
                    draftParent.children.push(
                        reccursiveGenerateChildren(newResponse, draftParent)[0]
                    );
                    return;
                }
                console.log(
                    "coucou",
                    reccursiveGenerateChildren(newResponse, draft)
                );
                draft.children = reccursiveGenerateChildren(newResponse, draft);
            });
        },
        [data, setData]
    );

    return useMemo(() => {
        return data.children.map((node) => {
            return (
                <Node
                    key={node.id}
                    id={node.id}
                    token={node.token}
                    parent={node}
                    askForSibling={handleAskForSibling}
                >
                    {node.children}
                </Node>
            );
        });
    }, [data.children, handleAskForSibling]);
}
