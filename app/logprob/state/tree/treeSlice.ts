import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OpenAI } from "openai";

type Token = OpenAI.ChatCompletionTokenLogprob;

export interface Node {
    token: Token;
    id: string;
    children: Node[];
}

const initialState: Node = {
    token: { token: "", logprob: 0, bytes: [], top_logprobs: [] },
    id: "0",
    children: [
        {
            token: { token: "Hello", logprob: 0, bytes: [], top_logprobs: [] },
            id: "0.0",
            children: [
                {
                    token: {
                        token: " How",
                        logprob: 0,
                        bytes: [],
                        top_logprobs: [],
                    },
                    id: "0.0.0",
                    children: [
                        {
                            token: {
                                token: " are",
                                logprob: 0,
                                bytes: [],
                                top_logprobs: [],
                            },
                            id: "0.0.0.0",
                            children: [
                                {
                                    token: {
                                        token: " you",
                                        logprob: 0,
                                        bytes: [],
                                        top_logprobs: [],
                                    },
                                    id: "0.0.0.0.0",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const makeId = (node: Node): string => {
    return `${node.id}.${
        node.children.length ? node.children.length : node.children.length + 1
    }`;
};

const findParentNode = (node: Node, id: string): Node | undefined => {
    for (const child of node.children) {
        if (child.id === id) {
            return node;
        }
        const found = findParentNode(child, id);
        if (found) {
            return found;
        }
    }
    return undefined;
};

export const treeSlice = createSlice({
    name: "tree",
    initialState,
    reducers: {
        addSibling: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            /* root cannot have a sibling */
            if (id === "0") {
                return;
            }
            const parent = findParentNode(state, id);
            console.log(parent?.id);
            if (parent) {
                parent.children.push({
                    token: {
                        token: "New sibling",
                        logprob: 0,
                        bytes: [],
                        top_logprobs: [],
                    },
                    id: makeId(parent),
                    children: [],
                });
            }
        },
    },
});

export const { addSibling } = treeSlice.actions;
export default treeSlice.reducer;
